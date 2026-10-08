from collections.abc import Sequence
from uuid import UUID, uuid4

import asyncpg


class TodoRepository:
    def __init__(self, pool: asyncpg.Pool) -> None:
        self._pool = pool

    async def find_all(self) -> Sequence[asyncpg.Record]:
        return await self._pool.fetch("SELECT id, title, completed, created_at FROM todos ORDER BY created_at DESC")

    async def create(self, title: str) -> asyncpg.Record:
        return await self._pool.fetchrow(
            "INSERT INTO todos (id, title) VALUES ($1, $2) RETURNING id, title, completed, created_at",
            uuid4(),
            title,
        )

    async def update(self, todo_id: UUID, title: str | None, completed: bool | None) -> asyncpg.Record | None:
        return await self._pool.fetchrow(
            """
            UPDATE todos
            SET title = COALESCE($2, title), completed = COALESCE($3, completed)
            WHERE id = $1
            RETURNING id, title, completed, created_at
            """,
            todo_id,
            title,
            completed,
        )

    async def remove(self, todo_id: UUID) -> bool:
        result = await self._pool.execute("DELETE FROM todos WHERE id = $1", todo_id)
        return result == "DELETE 1"

    async def clear_completed(self) -> None:
        await self._pool.execute("DELETE FROM todos WHERE completed = TRUE")
