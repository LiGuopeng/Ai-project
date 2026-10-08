from uuid import UUID

from fastapi import HTTPException, status

from app.modules.todos.repository import TodoRepository
from app.modules.todos.schemas import TodoResponse, UpdateTodoRequest


class TodoService:
    def __init__(self, repository: TodoRepository) -> None:
        self._repository = repository

    async def find_all(self) -> list[TodoResponse]:
        rows = await self._repository.find_all()
        return [TodoResponse.model_validate(dict(row), from_attributes=True) for row in rows]

    async def create(self, title: str) -> TodoResponse:
        row = await self._repository.create(title)
        return TodoResponse.model_validate(dict(row), from_attributes=True)

    async def update(self, todo_id: UUID, changes: UpdateTodoRequest) -> TodoResponse:
        row = await self._repository.update(todo_id, changes.title, changes.completed)
        if row is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="任务不存在")
        return TodoResponse.model_validate(dict(row), from_attributes=True)

    async def remove(self, todo_id: UUID) -> None:
        if not await self._repository.remove(todo_id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="任务不存在")

    async def clear_completed(self) -> None:
        await self._repository.clear_completed()
