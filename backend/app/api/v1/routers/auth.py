import os
from fastapi import APIRouter
from fastapi import status, HTTPException, Depends
from sqlmodel import Session, select
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.api.models import User, UserBase, UserWithBlogs, UserCreate, UserLogin, TokenResponse, TokenRefresh, TokenBlacklist, GoogleLoginRequest
from app.api.v1.deps import decode_token, get_current_active_user, hash_password, get_current_user, verify_password, create_access_token, create_refresh_token, decode_token
from app.api.db import get_session
from typing import Annotated

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


@router.post("/register", response_model=UserBase, status_code=status.HTTP_201_CREATED)
async def register(session: Annotated[Session, Depends(get_session)], user: UserCreate):
    """Register a new user."""
    # Check if user already exists
    result = await session.exec(select(User).where(User.username == user.username))
    existing_user = result.first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    result = await session.exec(select(User).where(User.email == user.email))
    existing_email = result.first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and store user
    hashed_password = hash_password(user.password)
    db_user = User(username=user.username, email=user.email, full_name=user.full_name, hashed_password=hashed_password)
    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    
    return db_user


@router.post("/login", response_model=TokenResponse)
async def login(session: Annotated[Session, Depends(get_session)], user: UserLogin):
    """Login and get access and refresh tokens."""
    # Verify user credentials
    result = await session.exec(select(User).where(User.username == user.username))
    db_user = result.first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    # Create tokens
    access_token = create_access_token(data={"sub": user.username})
    refresh_token = create_refresh_token(data={"sub": user.username})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(token_data: TokenRefresh):
    """Get new access token using refresh token."""
    # Verify refresh token
    print(f"Refreshing token: {token_data.refresh_token}")
    payload = decode_token(token_data.refresh_token)
    
    # Check if it's a refresh token
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type"
        )
    
    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
    # Create new tokens
    access_token = create_access_token(data={"sub": username})
    # new_refresh_token = create_refresh_token(data={"sub": username})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=token_data.refresh_token  # Reuse the same refresh token
    )


@router.post("/logout")
async def logout(session: Annotated[Session, Depends(get_session)], token_data: TokenRefresh):
    """Logout and invalidate refresh token."""
    # Decode the refresh token
    payload = decode_token(token_data.refresh_token)

    # Blacklist the token
    blacklisted_token = TokenBlacklist(token=token_data.refresh_token)
    session.add(blacklisted_token)
    await session.commit()

    return {"detail": "Successfully logged out"}


@router.get("/users/me", response_model=UserWithBlogs)
async def read_users_me(current_user: Annotated[User, Depends(get_current_active_user)]):
    """Get current user information (protected route)."""
    return current_user


@router.post("/google", response_model=TokenResponse)
async def google_login(session: Annotated[Session, Depends(get_session)], body: GoogleLoginRequest):
    """Login or register via Google OAuth credential (ID token)."""
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google OAuth is not configured on the server"
        )

    try:
        idinfo = id_token.verify_oauth2_token(
            body.credential,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}"
        )

    email: str = idinfo["email"]
    full_name: str | None = idinfo.get("name")
    google_sub: str = idinfo["sub"]

    # Find existing user by email
    result = await session.exec(select(User).where(User.email == email))
    db_user = result.first()

    if not db_user:
        # Derive a unique username from the email prefix
        base_username = email.split("@")[0]
        username = base_username
        counter = 1
        while True:
            check = await session.exec(select(User).where(User.username == username))
            if not check.first():
                break
            username = f"{base_username}{counter}"
            counter += 1

        db_user = User(
            username=username,
            email=email,
            full_name=full_name,
            hashed_password=hash_password(google_sub),
        )
        session.add(db_user)
        await session.commit()
        await session.refresh(db_user)

    access_token = create_access_token(data={"sub": db_user.username})
    refresh_token = create_refresh_token(data={"sub": db_user.username})

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)
