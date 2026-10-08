package com.todo.list.todos;

import jakarta.validation.constraints.Size;

public record UpdateTodoRequest(
        @Size(min = 1, max = 200, message = "title 长度必须为 1-200 个字符")
        String title,
        Boolean completed
) {
    public boolean isEmpty() {
        return title == null && completed == null;
    }
}
