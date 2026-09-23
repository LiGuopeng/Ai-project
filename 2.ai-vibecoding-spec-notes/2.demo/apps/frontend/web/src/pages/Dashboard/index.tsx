import { Filter, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@todo-list/react'

import { Sidebar } from '../../components/Sidebar'
import { StatsCard } from '../../components/StatsCard'
import { TodoInput } from '../../components/TodoInput'
import { TodoList } from '../../components/TodoList'
import { Topbar } from '../../components/Topbar'
import { useTodos } from '../../hooks/useTodos'
import type { TodoStatus } from '../../types/api'

const filters: Array<{ label: string; value: TodoStatus }> = [
    { label: '全部', value: 'all' },
    { label: '进行中', value: 'active' },
    { label: '已完成', value: 'completed' },
]

export default function Dashboard() {
    const [isCompact, setIsCompact] = useState(false)
    const {
        activeCount,
        addTodo,
        clearCompleted,
        completedCount,
        deleteTodo,
        error,
        isLoading,
        reloadTodos,
        setStatus,
        status,
        todos,
        totalCount,
        toggleTodo,
    } = useTodos()

    return (
        <div className="app-shell">
            <Sidebar activeCount={activeCount} onAllTodos={() => setStatus('all')} />
            <main className="main-content">
                <Topbar />
                <div className="dashboard-grid">
                    <section className="content-column">
                        <div className="section-heading">
                            <div>
                                <p className="eyebrow">我的空间 / 今日</p>
                                <h2>我的任务</h2>
                            </div>
                            <span className="task-count">{activeCount} 个待完成</span>
                        </div>
                        <TodoInput onAdd={addTodo} />
                        <div className="list-toolbar">
                            <div className="filter-tabs" role="tablist" aria-label="任务筛选">
                                {filters.map(filter => (
                                    <button
                                        aria-selected={status === filter.value}
                                        className={status === filter.value ? 'filter-tab filter-tab-active' : 'filter-tab'}
                                        key={filter.value}
                                        onClick={() => setStatus(filter.value)}
                                        role="tab"
                                        type="button"
                                    >
                                        {filter.label}
                                        {filter.value === 'active' && <span>{activeCount}</span>}
                                    </button>
                                ))}
                            </div>
                            <div className="toolbar-actions">
                                <button aria-label="筛选任务" className="toolbar-icon" type="button">
                                    <Filter size={16} />
                                </button>
                                <button
                                    aria-label="切换紧凑模式"
                                    className={`toolbar-icon ${isCompact ? 'toolbar-icon-active' : ''}`}
                                    onClick={() => setIsCompact(value => !value)}
                                    type="button"
                                >
                                    <SlidersHorizontal size={16} />
                                </button>
                            </div>
                        </div>
                        <div className={isCompact ? 'todo-panel todo-panel-compact' : 'todo-panel'}>
                            {error ? (
                                <div className="request-state request-state-error">
                                    <p>{error}</p>
                                    <Button onClick={() => void reloadTodos()} variant="secondary">
                                        重新加载
                                    </Button>
                                </div>
                            ) : isLoading ? (
                                <div className="request-state">
                                    <div className="loading-dot" />
                                    <p>正在加载任务...</p>
                                </div>
                            ) : (
                                <TodoList onDelete={deleteTodo} onToggle={toggleTodo} todos={todos} />
                            )}
                            {!isLoading && !error && completedCount > 0 && (
                                <div className="list-footer">
                                    <span>{completedCount} 个任务已完成</span>
                                    <Button onClick={clearCompleted} variant="ghost">
                                        清除已完成
                                    </Button>
                                </div>
                            )}
                        </div>
                    </section>
                    <aside className="right-column">
                        <StatsCard activeCount={activeCount} completedCount={completedCount} totalCount={totalCount} />
                        <section className="focus-card">
                            <div className="focus-orb" />
                            <p className="eyebrow">今日小提醒</p>
                            <h3>一次只做一件事，也是一种效率。</h3>
                            <p>把注意力放在眼前的任务上，完成之后再走向下一步。</p>
                        </section>
                    </aside>
                </div>
            </main>
        </div>
    )
}
