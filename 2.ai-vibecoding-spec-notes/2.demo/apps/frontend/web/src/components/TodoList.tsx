import { ClipboardList } from 'lucide-react'

import type { Todo } from '../types/api'
import { TodoItem } from './TodoItem'

interface TodoListProps {
    onDelete: (id: string) => Promise<void>
    onToggle: (id: string) => Promise<void>
    todos: Todo[]
}

export function TodoList({ onDelete, onToggle, todos }: TodoListProps) {
    if (todos.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">
                    <ClipboardList size={28} />
                </div>
                <h3>这里还没有任务</h3>
                <p>把脑海里的下一步写下来，给今天一个轻盈的开始。</p>
            </div>
        )
    }

    return (
        <ul className="todo-list">
            {todos.map(todo => (
                <TodoItem key={todo.id} onDelete={onDelete} onToggle={onToggle} todo={todo} />
            ))}
        </ul>
    )
}
