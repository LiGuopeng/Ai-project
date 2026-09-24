import { Injectable, NotFoundException } from '@nestjs/common'
import { randomUUID } from 'node:crypto'

import type { TodoEntity } from '../../entities/todo'
import { DatabaseService } from '../../database/database.service'
import type { UpdateTodoDto } from './dto/update-todo.dto'

interface TodoRow {
    completed: boolean
    created_at: Date
    id: string
    title: string
}

@Injectable()
export class TodoService {
    constructor(private readonly database: DatabaseService) {}

    async findAll(): Promise<TodoEntity[]> {
        const result = await this.database.query<TodoRow>('SELECT id, title, completed, created_at FROM todos ORDER BY created_at DESC')
        return result.rows.map(row => this.toEntity(row))
    }

    async create(title: string): Promise<TodoEntity> {
        const result = await this.database.query<TodoRow>(
            'INSERT INTO todos (id, title) VALUES ($1, $2) RETURNING id, title, completed, created_at',
            [randomUUID(), title]
        )
        const row = result.rows[0]
        if (!row) {
            throw new Error('创建任务失败')
        }
        return this.toEntity(row)
    }

    async update(id: string, changes: UpdateTodoDto): Promise<TodoEntity> {
        const result = await this.database.query<TodoRow>(
            `UPDATE todos
             SET title = COALESCE($2, title), completed = COALESCE($3, completed)
             WHERE id = $1
             RETURNING id, title, completed, created_at`,
            [id, changes.title ?? null, changes.completed ?? null]
        )
        const row = result.rows[0]
        if (!row) {
            throw new NotFoundException('任务不存在')
        }
        return this.toEntity(row)
    }

    async remove(id: string): Promise<void> {
        const result = await this.database.query('DELETE FROM todos WHERE id = $1', [id])
        if (result.rowCount !== 1) {
            throw new NotFoundException('任务不存在')
        }
    }

    async clearCompleted(): Promise<void> {
        await this.database.query('DELETE FROM todos WHERE completed = TRUE')
    }

    private toEntity(row: TodoRow): TodoEntity {
        return {
            completed: row.completed,
            createdAt: row.created_at.toISOString(),
            id: row.id,
            title: row.title,
        }
    }
}
