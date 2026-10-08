package com.todo.list.todos;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class TodoRepository {
    private final JdbcTemplate jdbcTemplate;

    public TodoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Todo> findAll() {
        return jdbcTemplate.query(
                "SELECT id, title, completed, created_at FROM todos ORDER BY created_at DESC",
                this::mapRow
        );
    }

    public Todo create(UUID id, String title) {
        return jdbcTemplate.queryForObject(
                "INSERT INTO todos (id, title) VALUES (?, ?) RETURNING id, title, completed, created_at",
                this::mapRow,
                id,
                title
        );
    }

    public Todo update(UUID id, String title, Boolean completed) {
        List<Todo> rows = jdbcTemplate.query(
                """
                UPDATE todos
                SET title = COALESCE(?, title), completed = COALESCE(?, completed)
                WHERE id = ?
                RETURNING id, title, completed, created_at
                """,
                this::mapRow,
                title,
                completed,
                id
        );
        return rows.isEmpty() ? null : rows.getFirst();
    }

    public boolean delete(UUID id) {
        return jdbcTemplate.update("DELETE FROM todos WHERE id = ?", id) == 1;
    }

    public void deleteCompleted() {
        jdbcTemplate.update("DELETE FROM todos WHERE completed = TRUE");
    }

    private Todo mapRow(ResultSet resultSet, int rowNumber) throws SQLException {
        return new Todo(
                resultSet.getObject("id", UUID.class),
                resultSet.getString("title"),
                resultSet.getBoolean("completed"),
                resultSet.getObject("created_at", java.time.OffsetDateTime.class)
        );
    }
}
