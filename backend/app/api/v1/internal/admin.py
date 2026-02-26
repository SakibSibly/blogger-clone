from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Annotated
import uuid

from app.api.db import get_session
from app.api.models import User, UserAdminDisplay, UserStatusUpdate, HeroCard, HeroCardBase
from app.api.v1.deps import get_current_superuser

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(get_current_superuser)]
)


@router.patch("/users/{user_id}/status", response_model=UserAdminDisplay)
async def update_user_status(
    user_id: uuid.UUID,
    status_update: UserStatusUpdate,
    session: Annotated[Session, Depends(get_session)],
    current_admin: Annotated[User, Depends(get_current_superuser)]
):
    """
    Update user active status (activate or deactivate).
    Only accessible by superusers.
    """
    # Prevent admin from deactivating themselves
    if user_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot modify your own status"
        )
    
    # Get the user to update
    result = await session.exec(select(User).where(User.id == user_id))
    user = result.first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update the user's active status
    user.is_active = status_update.is_active
    session.add(user)
    await session.commit()
    await session.refresh(user)
    
    return user


@router.get("/users", response_model=list[UserAdminDisplay])
async def list_all_users(
    session: Annotated[Session, Depends(get_session)],
    skip: int = 0,
    limit: int = 100
):
    """
    Get list of all users.
    Only accessible by superusers.
    """
    result = await session.exec(select(User).offset(skip).limit(limit))
    users = result.all()
    return users


@router.get("/hero-cards", response_model=list[HeroCardBase])
async def list_all_hero_cards(
    session: Annotated[Session, Depends(get_session)]
):
    """
    Get list of all hero cards.
    Only accessible by superusers.
    """
    result = await session.exec(select(HeroCard))
    hero_cards = result.all()
    return hero_cards

@router.post("/hero-cards", response_model=HeroCardBase)
async def create_hero_card(
    hero_card_data: HeroCardBase,
    session: Annotated[Session, Depends(get_session)]
):
    """
    Create a new hero card.
    Only accessible by superusers.
    """
    hero_card = HeroCard.model_validate(hero_card_data)
    session.add(hero_card)
    await session.commit()
    await session.refresh(hero_card)
    return hero_card

@router.delete("/hero-cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_hero_card(
    card_id: uuid.UUID,
    session: Annotated[Session, Depends(get_session)]
):
    """
    Delete a hero card by ID.
    Only accessible by superusers.
    """
    result = await session.exec(select(HeroCard).where(HeroCard.id == card_id))
    hero_card = result.first()
    
    if not hero_card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hero card not found"
        )
    
    await session.delete(hero_card)
    await session.commit()
