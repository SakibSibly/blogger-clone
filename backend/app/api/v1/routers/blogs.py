import uuid
import datetime

from fastapi import APIRouter, Depends, HTTPException
from fastapi import status
from typing import Annotated
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from app.api.models import BlogEdit, BlogPublic, BlogBase, Blog, User
from app.api.db import get_session
from app.api.v1.deps import get_current_active_user

router = APIRouter(
    prefix="/blogs",
    tags=["blogs"]
)

@router.get("/", response_model=list[BlogPublic])
async def get_blogs(
    session: Annotated[AsyncSession, Depends(get_session)],
    skip: int = 0,
    limit: int = 15
):
    statement = select(Blog).offset(skip).limit(limit).order_by(Blog.created_at.desc())
    result = await session.exec(statement)
    blogs = result.all()

    return blogs

@router.post("/", response_model=BlogPublic, status_code=status.HTTP_201_CREATED)
async def create_blog(
    session: Annotated[AsyncSession, Depends(get_session)],
    blog: BlogBase,
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    db_blog = Blog(**blog.model_dump(), author_id=current_user.id)
    session.add(db_blog)
    await session.commit()
    await session.refresh(db_blog)

    return db_blog

@router.get("/{blog_id}", response_model=BlogPublic, status_code=status.HTTP_200_OK)
async def get_blog(
    session: Annotated[AsyncSession, Depends(get_session)],
    blog_id: uuid.UUID
):
    statement = select(Blog).where(Blog.id == blog_id)
    result = await session.exec(statement)
    blog = result.first()

    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")

    return blog

@router.patch("/{blog_id}", response_model=BlogPublic)
async def update_blog(
    session: Annotated[AsyncSession, Depends(get_session)],
    blog_id: uuid.UUID,
    blog_update: BlogEdit,
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    statement = select(Blog).where(Blog.author_id == current_user.id, Blog.id == blog_id)
    result = await session.exec(statement)
    blog = result.first()

    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")

    update_data = blog_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(blog, key, value)

    if blog_update.published is not None and blog_update.published:
        blog.updated_at = datetime.datetime.now(datetime.timezone.utc).isoformat()

    session.add(blog)
    await session.commit()
    await session.refresh(blog)

    return blog


@router.delete("/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog(
    session: Annotated[AsyncSession, Depends(get_session)],
    blog_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    statement = select(Blog).where(Blog.author_id == current_user.id, Blog.id == blog_id)
    result = await session.exec(statement)
    blog = result.first()

    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")

    await session.delete(blog)
    await session.commit()

    return {"message": "Blog deleted successfully"}


@router.post("/{blog_id}/publish", response_model=BlogPublic)
async def publish_blog(
    session: Annotated[AsyncSession, Depends(get_session)],
    blog_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    statement = select(Blog).where(Blog.author_id == current_user.id, Blog.id == blog_id)
    result = await session.exec(statement)
    blog = result.first()

    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")

    blog.published = True

    session.add(blog)
    await session.commit()
    await session.refresh(blog)

    return blog

@router.post("/{blog_id}/unpublish", response_model=BlogPublic)
async def unpublish_blog(
    session: Annotated[AsyncSession, Depends(get_session)],
    blog_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    statement = select(Blog).where(Blog.author_id == current_user.id, Blog.id == blog_id)
    result = await session.exec(statement)
    blog = result.first()

    if not blog:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog not found")

    blog.published = False
    blog.updated_at = datetime.datetime.now(datetime.timezone.utc).isoformat()

    session.add(blog)
    await session.commit()
    await session.refresh(blog)

    return blog