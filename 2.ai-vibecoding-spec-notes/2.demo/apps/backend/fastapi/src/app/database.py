from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import asyncpg

from app.config import Settings


CREATE_TODOS_TABLE = """
CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)
"""


class Database:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self.pool: asyncpg.Pool | None = None

    async def connect(self) -> None:
        self.pool = await asyncpg.create_pool(
            database=self._settings.db_name,
            host=self._settings.db_host,
            password=self._settings.db_password,
            port=self._settings.db_port,
            user=self._settings.db_user,
            min_size=1,
            max_size=10,
        )
        await self.pool.execute(CREATE_TODOS_TABLE)

    async def close(self) -> None:
        if self.pool is not None:
            await self.pool.close()
            self.pool = None

    def get_pool(self) -> asyncpg.Pool:
        if self.pool is None:
            raise RuntimeError("数据库连接池尚未初始化")
        return self.pool


@asynccontextmanager
async def lifespan(settings: Settings) -> AsyncIterator[Database]:
    database = Database(settings)
    await database.connect()
    try:
        yield database
    finally:
        await database.close()
