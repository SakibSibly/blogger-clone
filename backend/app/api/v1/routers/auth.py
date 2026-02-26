import os
import uuid
from fastapi import APIRouter
from fastapi import status, HTTPException, Depends
from sqlmodel import Session, select
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.api.models import User, UserWithBlogs, TokenResponse, TokenRefresh, TokenBlacklist, GoogleLoginRequest
from app.api.v1.deps import decode_token, get_current_active_user, hash_password, get_current_user, verify_password, create_access_token, create_refresh_token, decode_token
from app.api.db import get_session
from typing import Annotated

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(token_data: TokenRefresh):
    """Get new access token using refresh token."""
    # Verify refresh token
    payload = decode_token(token_data.refresh_token)
    
    # Check if it's a refresh token
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type"
        )
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
    # Create new tokens
    access_token = create_access_token(data={"sub": user_id})
    # new_refresh_token = create_refresh_token(data={"sub": user_id})
    
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
        # Derive a unique username from the email prefix with a random hex suffix
        # to avoid sequential DB queries and potential infinite loops
        base_username = email.split("@")[0]
        username = f"{base_username}_{uuid.uuid4().hex[:8]}"
        check = await session.exec(select(User).where(User.username == username))
        while check.first():  # extremely unlikely; re-roll on collision
            username = f"{base_username}_{uuid.uuid4().hex[:8]}"
            check = await session.exec(select(User).where(User.username == username))

        db_user = User(
            username=username,
            email=email,
            full_name=full_name,
            hashed_password=hash_password(google_sub),
        )
        session.add(db_user)
        await session.commit()
        await session.refresh(db_user)

    access_token = create_access_token(data={"sub": str(db_user.id)})
    refresh_token = create_refresh_token(data={"sub": str(db_user.id)})

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)
