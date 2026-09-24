import { NextResponse } from 'next/server'

import { removeTodo, updateTodo } from '../../../../modules/todos/todo.service'

interface RouteContext {
    params: {
        id: string
    }
}

export async function PATCH(request: Request, { params }: RouteContext) {
    const body = (await request.json().catch(() => null)) as { completed?: unknown; title?: unknown } | null
    const changes: { completed?: boolean; title?: string } = {}

    if (typeof body?.completed === 'boolean') {
        changes.completed = body.completed
    }

    if (typeof body?.title === 'string') {
        const title = body.title.trim()
        if (title.length < 1 || title.length > 200) {
            return NextResponse.json({ message: '任务标题长度必须为 1-200 个字符' }, { status: 400 })
        }
        changes.title = title
    }

    const todo = await updateTodo(params.id, changes)
    if (!todo) {
        return NextResponse.json({ message: '任务不存在' }, { status: 404 })
    }

    return NextResponse.json(todo)
}

export async function DELETE(_request: Request, { params }: RouteContext) {
    const removed = await removeTodo(params.id)
    if (!removed) {
        return NextResponse.json({ message: '任务不存在' }, { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
}
