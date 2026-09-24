import { randomUUID } from 'node:crypto'

import type { TodoEntity } from '../../entities/todo'
import { ensureSchema, pool } from '../../lib/db'

interface TodoRow {
    completed: boolean
    created_at: Date
    id: string
    title: string
}

function toEntity(row: TodoRow): TodoEntity {
    return {
        completed: row.completed,
        createdAt: row.created_at.toISOString(),
        id: row.id,
        title: row.title,
    }
}

export async function listTodos(): Promise<TodoEntity[]> {
    await ensureSchema()
    const result = await pool.query<TodoRow>('SELECT id, title, completed, created_at FROM todos ORDER BY created_at DESC')
    return result.rows.map(toEntity)
}

export async function createTodo(title: string): Promise<TodoEntity> {
    await ensureSchema()
    const result = await pool.query<TodoRow>('INSERT INTO todos (id, title) VALUES ($1, $2) RETURNING id, title, completed, created_at', [
        randomUUID(),
        title,
    ])
    return toEntity(result.rows[0]!)
}

export async function updateTodo(id: string, changes: { completed?: boolean; title?: string }): Promise<TodoEntity | null> {
    await ensureSchema()
    const result = await pool.query<TodoRow>(
        `UPDATE todos
         SET title = COALESCE($2, title), completed = COALESCE($3, completed)
         WHERE id = $1
         RETURNING id, title, completed, created_at`,
        [id, changes.title ?? null, changes.completed ?? null]
    )
    return result.rows[0] ? toEntity(result.rows[0]) : null
}

export async function removeTodo(id: string): Promise<boolean> {
    await ensureSchema()
    const result = await pool.query('DELETE FROM todos WHERE id = $1', [id])
    return result.rowCount === 1
}

export async function clearCompletedTodos(): Promise<void> {
    await ensureSchema()
    await pool.query('DELETE FROM todos WHERE completed = TRUE')
}
