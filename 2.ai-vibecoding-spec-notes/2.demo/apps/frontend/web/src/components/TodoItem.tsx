import { MoreHorizontal, Trash2 } from 'lucide-react'

import { Checkbox } from '@todo-list/react'

import type { Todo } from '../types/api'

interface TodoItemProps {
    onDelete: (id: string) => Promise<void>
    onToggle: (id: string) => Promise<void>
    todo: Todo
}

export function TodoItem({ onDelete, onToggle, todo }: TodoItemProps) {
    return (
        <li className={`todo-item ${todo.completed ? 'todo-item-completed' : ''}`}>
            <Checkbox
                aria-label={todo.completed ? `标记 ${todo.title} 为未完成` : `标记 ${todo.title} 为已完成`}
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
            />
            <div className="todo-copy">
                <span className="todo-title">{todo.title}</span>
                <span className="todo-date">今天 · {todo.completed ? '已完成' : '待处理'}</span>
            </div>
            <div className="todo-actions">
                <button aria-label="更多操作" className="item-icon-button" type="button">
                    <MoreHorizontal size={18} />
                </button>
                <button
                    aria-label={`删除 ${todo.title}`}
                    className="item-icon-button item-delete"
                    onClick={() => onDelete(todo.id)}
                    type="button"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </li>
    )
}
