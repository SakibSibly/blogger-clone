from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routers import auth, blogs
from app.api.v1.internal import admin


app = FastAPI(
    title="Blogger API",
    description="Blogger Clone API built with FastAPI",
    version="0.0.1"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check():
    return {
        "status": "ok",
        "message": "Blogger API is healthy and running!"
    }

# Available API routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(blogs.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")