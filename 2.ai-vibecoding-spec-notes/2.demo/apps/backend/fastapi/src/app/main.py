from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import get_settings
from app.database import Database, lifespan
from app.health import router as health_router
from app.modules.todos.router import router as todos_router


@asynccontextmanager
async def app_lifespan(app: FastAPI):
    async with lifespan(get_settings()) as database:
        app.state.database = database
        yield


app = FastAPI(
    title="Todo List API",
    version="1.0.0",
    lifespan=app_lifespan,
)
app.include_router(health_router, prefix="/api")
app.include_router(todos_router, prefix="/api")
