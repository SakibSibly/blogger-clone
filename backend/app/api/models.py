from sqlmodel import SQLModel, Field, Relationship
from pydantic import EmailStr
import uuid
import datetime


class UserBase(SQLModel):
    username: str = Field(default=None, index=True, max_length=50)
    email: EmailStr = Field(default=None, index=True, max_length=100)
    full_name: str | None = Field(default=None, max_length=255)


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    blogs: list["Blog"] = Relationship(back_populates="author", sa_relationship_kwargs={"lazy": "selectin"}, cascade_delete=True)
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)
    hashed_password: str = Field(default=None, max_length=256)


class UserAdminDisplay(UserBase):
    id: uuid.UUID
    is_active: bool
    is_superuser: bool


class UserPublic(UserBase):
    id: uuid.UUID


class UserLogin(SQLModel):
    username: str = Field(default=None, max_length=50)
    password: str = Field(default=None, max_length=256)


class UserCreate(UserBase):
    password: str = Field(default=None, max_length=256)


class UserWithBlogs(UserPublic):
    blogs: list["Blog"] = []


class TokenResponse(SQLModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(SQLModel):
    refresh_token: str


class TokenBlacklist(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    token: str = Field(index=True, unique=True)


class UserStatusUpdate(SQLModel):
    is_active: bool


class BlogBase(SQLModel):
    title: str = Field(default=None, max_length=255)
    content: str = Field(default=None)
    published: bool = Field(default=False)


class Blog(BlogBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    author_id: uuid.UUID | None = Field(default=None, foreign_key="user.id", index=True, ondelete="CASCADE")
    created_at: str = Field(default_factory=lambda: datetime.datetime.now(datetime.timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.datetime.now(datetime.timezone.utc).isoformat())
    author_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    author: User = Relationship(back_populates="blogs")


class BlogPublic(BlogBase):
    id: uuid.UUID
    author_id: uuid.UUID
    created_at: str
    updated_at: str