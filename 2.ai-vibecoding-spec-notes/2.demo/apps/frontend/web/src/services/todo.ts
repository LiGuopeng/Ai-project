import type { CreateTodoInput, Todo } from '../types/api'

const API_BASE_URL = '/api/todos'

async function request<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    const response = await fetch(input, {
        headers: {
            'Content-Type': 'application/json',
            ...init?.headers,
        },
        ...init,
    })

    if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { message?: string } | null
        throw new Error(body?.message ?? '请求失败，请稍后重试')
    }

    if (response.status === 204) {
        return undefined as T
    }

    return (await response.json()) as T
}

export function listTodos(): Promise<Todo[]> {
    return request<Todo[]>(API_BASE_URL)
}

export function createTodo(input: CreateTodoInput): Promise<Todo> {
    return request<Todo>(API_BASE_URL, {
        body: JSON.stringify(input),
        method: 'POST',
    })
}

export function updateTodo(id: string, changes: Partial<Pick<Todo, 'completed' | 'title'>>): Promise<Todo> {
    return request<Todo>(`${API_BASE_URL}/${id}`, {
        body: JSON.stringify(changes),
        method: 'PATCH',
    })
}

export function removeTodo(id: string): Promise<void> {
    return request<void>(`${API_BASE_URL}/${id}`, { method: 'DELETE' })
}

export function clearCompletedTodos(): Promise<void> {
    return request<void>(`${API_BASE_URL}/completed`, { method: 'DELETE' })
}
