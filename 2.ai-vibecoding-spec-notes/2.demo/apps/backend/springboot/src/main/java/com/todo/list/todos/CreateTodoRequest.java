package com.todo.list.todos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTodoRequest(
        @NotBlank(message = "title 不能为空")
        @Size(max = 200, message = "title 长度不能超过 200 个字符")
        String title
) {
}
