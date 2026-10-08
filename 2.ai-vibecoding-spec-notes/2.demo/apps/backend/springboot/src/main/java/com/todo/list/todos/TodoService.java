package com.todo.list.todos;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TodoService {
    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public List<Todo> findAll() {
        return todoRepository.findAll();
    }

    public Todo create(String title) {
        return todoRepository.create(UUID.randomUUID(), title.trim());
    }

    public Todo update(UUID id, UpdateTodoRequest request) {
        Todo todo = todoRepository.update(id, request.title() == null ? null : request.title().trim(), request.completed());
        if (todo == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "任务不存在");
        }
        return todo;
    }

    public void delete(UUID id) {
        if (!todoRepository.delete(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "任务不存在");
        }
    }

    public void deleteCompleted() {
        todoRepository.deleteCompleted();
    }
}
