import { NextResponse } from 'next/server'

import { createTodo, listTodos } from '../../../modules/todos/todo.service'

export async function GET() {
    return NextResponse.json(await listTodos())
}

export async function POST(request: Request) {
    const body = (await request.json().catch(() => null)) as { title?: unknown } | null
    const title = typeof body?.title === 'string' ? body.title.trim() : ''

    if (title.length < 1 || title.length > 200) {
        return NextResponse.json({ message: '任务标题长度必须为 1-200 个字符' }, { status: 400 })
    }

    return NextResponse.json(await createTodo(title), { status: 201 })
}
