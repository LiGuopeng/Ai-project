import { Ellipsis, Plus, Star } from 'lucide-react'
import { useState } from 'react'

import { Sidebar } from '../../components/Sidebar'
import { TodoInput } from '../../components/TodoInput'
import { TodoList } from '../../components/TodoList'
import { Topbar } from '../../components/Topbar'
import { useTodos } from '../../hooks/useTodos'

export default function Dashboard() {
    const [isAdding, setIsAdding] = useState(false)
    const { activeCount, addTodo, completedCount, deleteTodo, error, isLoading, reloadTodos, todos, toggleTodo } = useTodos()

    return (
        <div className="app-shell">
            <Sidebar activeCount={activeCount} onAllTodos={() => undefined} onCompleted={() => undefined} />
            <main className="main-content">
                <Topbar />
                <div className="today-content">
                    <div className="page-title-row">
                        <div className="page-title-left">
                            <Star className="today-star" size={25} />
                            <h1>Today</h1>
                            <span>{activeCount} tasks</span>
                        </div>
                        <button aria-label="More actions" className="plain-icon-button" type="button">
                            <Ellipsis size={22} />
                        </button>
                    </div>
                    <div className="daily-summary">You have a clear path today. Keep the momentum going!</div>
                    <section className="tasks-section" aria-label="Today tasks">
                        {error ? (
                            <div className="request-state request-state-error">
                                <p>{error}</p>
                                <button onClick={() => void reloadTodos()} type="button">
                                    Reload
                                </button>
                            </div>
                        ) : isLoading ? (
                            <div className="request-state">
                                <div className="loading-dot" />
                                <p>Loading tasks...</p>
                            </div>
                        ) : (
                            <TodoList onDelete={deleteTodo} onToggle={toggleTodo} todos={todos} />
                        )}
                    </section>
                    {isAdding ? (
                        <TodoInput
                            onAdd={async title => {
                                await addTodo(title)
                                setIsAdding(false)
                            }}
                        />
                    ) : (
                        <button className="add-task-button" onClick={() => setIsAdding(true)} type="button">
                            <Plus size={17} />
                            Add a task
                        </button>
                    )}
                    {completedCount > 0 && <span className="completed-hint">{completedCount} completed</span>}
                </div>
            </main>
        </div>
    )
}
