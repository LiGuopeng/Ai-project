from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from app.database import Database
from app.modules.todos.repository import TodoRepository
from app.modules.todos.schemas import CreateTodoRequest, TodoResponse, UpdateTodoRequest
from app.modules.todos.service import TodoService

router = APIRouter(prefix="/todos", tags=["todos"])


def get_todo_service(request: Request) -> TodoService:
    database: Database = request.app.state.database
    return TodoService(TodoRepository(database.get_pool()))


TodoServiceDependency = Annotated[TodoService, Depends(get_todo_service)]


@router.delete("/completed", status_code=status.HTTP_204_NO_CONTENT)
async def clear_completed(service: TodoServiceDependency) -> Response:
    await service.clear_completed()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("", response_model=list[TodoResponse])
async def list_todos(service: TodoServiceDependency) -> list[TodoResponse]:
    return await service.find_all()


@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
async def create_todo(payload: CreateTodoRequest, service: TodoServiceDependency) -> TodoResponse:
    return await service.create(payload.title)


@router.patch("/{todo_id}", response_model=TodoResponse)
async def update_todo(todo_id: UUID, payload: UpdateTodoRequest, service: TodoServiceDependency) -> TodoResponse:
    if payload.title is None and payload.completed is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="至少提供一个需要更新的字段")
    return await service.update(todo_id, payload)


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(todo_id: UUID, service: TodoServiceDependency) -> Response:
    await service.remove(todo_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
