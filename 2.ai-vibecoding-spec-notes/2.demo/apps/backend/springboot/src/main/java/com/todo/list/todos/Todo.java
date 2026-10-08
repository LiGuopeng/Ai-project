package com.todo.list.todos;

import java.time.OffsetDateTime;
import java.util.UUID;

public record Todo(UUID id, String title, boolean completed, OffsetDateTime createdAt) {
}
