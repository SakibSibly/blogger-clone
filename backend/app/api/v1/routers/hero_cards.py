from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import Annotated

from app.api.db import get_session
from app.api.models import HeroCardBase, HeroCard

router = APIRouter(
    prefix="/hero-cards",
    tags=["hero-cards"],
)

@router.get("/", response_model=list[HeroCardBase])
async def list_all_hero_cards(
    session: Annotated[Session, Depends(get_session)]
):
    """
    Get list of all hero cards.
    accessible by anyone (no auth required).
    """
    result = await session.exec(select(HeroCard))
    hero_cards = result.all()
    return hero_cards