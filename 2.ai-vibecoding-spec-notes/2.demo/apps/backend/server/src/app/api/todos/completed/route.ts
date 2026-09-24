import { NextResponse } from 'next/server'

import { clearCompletedTodos } from '../../../../modules/todos/todo.service'

export async function DELETE() {
    await clearCompletedTodos()
    return new NextResponse(null, { status: 204 })
}
