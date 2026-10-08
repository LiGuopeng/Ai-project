import { MoreHorizontal } from 'lucide-react'

import { Checkbox } from '@todo-list/react'

import type { Todo } from '../types/api'

interface TodoItemProps {
    index: number
    onDelete: (id: string) => Promise<void>
    onToggle: (id: string) => Promise<void>
    todo: Todo
}

export function TodoItem({ index, onDelete, onToggle, todo }: TodoItemProps) {
    const project = ['Work', 'Work', 'Personal', 'Personal', 'Learning'][index] ?? 'Today'
    const duration = [15, 30, 10, 20, 25][index] ?? 15
    const tag = index === 0 ? 'today' : index === 1 ? 'important' : ''

    return (
        <li className={`todo-item ${todo.completed ? 'todo-item-completed' : ''}`}>
            <Checkbox
                aria-label={todo.completed ? `标记 ${todo.title} 为未完成` : `标记 ${todo.title} 为已完成`}
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
            />
            <div className="todo-copy">
                <span className="todo-title">{todo.title}</span>
                <span className="todo-date">
                    {project} · {duration} min
                </span>
            </div>
            {tag && <span className={`todo-tag todo-tag-${tag}`}>{tag}</span>}
            <button aria-label={`删除 ${todo.title}`} className="item-icon-button" onClick={() => onDelete(todo.id)} type="button">
                <MoreHorizontal size={18} />
            </button>
        </li>
    )
}
