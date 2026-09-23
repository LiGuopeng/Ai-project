import { useCallback, useEffect, useMemo, useState } from 'react'

import { clearCompletedTodos, createTodo, listTodos, removeTodo, updateTodo } from '../services/todo'
import type { Todo, TodoStatus } from '../types/api'

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [status, setStatus] = useState<TodoStatus>('all')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const reloadTodos = useCallback(async () => {
        setIsLoading(true)
        setError('')
        try {
            setTodos(await listTodos())
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : '任务加载失败')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        void reloadTodos()
    }, [reloadTodos])

    const addTodo = useCallback(async (title: string) => {
        if (!title.trim()) {
            return
        }
        const todo = await createTodo({ title })
        setTodos(current => [todo, ...current])
    }, [])

    const toggleTodo = useCallback(
        async (id: string) => {
            const current = todos.find(todo => todo.id === id)
            if (!current) {
                return
            }
            const updated = await updateTodo(id, { completed: !current.completed })
            setTodos(items => items.map(todo => (todo.id === id ? updated : todo)))
        },
        [todos]
    )

    const deleteTodo = useCallback(async (id: string) => {
        await removeTodo(id)
        setTodos(current => current.filter(todo => todo.id !== id))
    }, [])

    const clearCompleted = useCallback(async () => {
        await clearCompletedTodos()
        setTodos(current => current.filter(todo => !todo.completed))
    }, [])

    const visibleTodos = useMemo(() => {
        if (status === 'active') {
            return todos.filter(todo => !todo.completed)
        }
        if (status === 'completed') {
            return todos.filter(todo => todo.completed)
        }
        return todos
    }, [status, todos])

    const completedCount = todos.filter(todo => todo.completed).length
    const activeCount = todos.length - completedCount

    return {
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
        todos: visibleTodos,
        totalCount: todos.length,
        toggleTodo,
    }
}
