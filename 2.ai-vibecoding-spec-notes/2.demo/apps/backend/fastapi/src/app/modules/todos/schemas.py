from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, StringConstraints


TodoTitle = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=200)]


class CreateTodoRequest(BaseModel):
    title: TodoTitle


class UpdateTodoRequest(BaseModel):
    completed: bool | None = None
    title: TodoTitle | None = None


class TodoResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: UUID
    title: str
    completed: bool
    created_at: datetime = Field(alias="createdAt")
