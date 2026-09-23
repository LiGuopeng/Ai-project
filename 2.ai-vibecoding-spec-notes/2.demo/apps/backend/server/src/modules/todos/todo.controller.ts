import type { IncomingMessage, ServerResponse } from 'node:http'

import { clearCompletedTodos, createTodo, listTodos, removeTodo, updateTodo } from './todo.service'

type JsonBody = Record<string, unknown>

async function readBody(request: IncomingMessage): Promise<JsonBody> {
    const chunks: Buffer[] = []
    for await (const chunk of request) {
        chunks.push(Buffer.from(chunk))
    }
    if (chunks.length === 0) {
        return {}
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as JsonBody
}

function sendJson(response: ServerResponse, statusCode: number, body: unknown) {
    response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' })
    response.end(JSON.stringify(body))
}

function sendError(response: ServerResponse, statusCode: number, message: string) {
    sendJson(response, statusCode, { message })
}

function isValidId(id: string) {
    return /^[0-9a-f-]{36}$/i.test(id)
}

export async function handleTodoRequest(request: IncomingMessage, response: ServerResponse, pathname: string) {
    const pathParts = pathname.split('/').filter(Boolean)
    const id = pathParts[2]

    if (request.method === 'GET' && pathParts.length === 2) {
        sendJson(response, 200, await listTodos())
        return
    }

    if (request.method === 'POST' && pathParts.length === 2) {
        const body = await readBody(request)
        const title = typeof body.title === 'string' ? body.title.trim() : ''
        if (title.length < 1 || title.length > 200) {
            sendError(response, 400, '任务标题长度必须为 1-200 个字符')
            return
        }
        sendJson(response, 201, await createTodo(title))
        return
    }

    if (request.method === 'PATCH' && id && pathParts.length === 3 && isValidId(id)) {
        const body = await readBody(request)
        const changes: { completed?: boolean; title?: string } = {}
        if (typeof body.completed === 'boolean') {
            changes.completed = body.completed
        }
        if (typeof body.title === 'string') {
            const title = body.title.trim()
            if (title.length < 1 || title.length > 200) {
                sendError(response, 400, '任务标题长度必须为 1-200 个字符')
                return
            }
            changes.title = title
        }
        const todo = await updateTodo(id, changes)
        if (!todo) {
            sendError(response, 404, '任务不存在')
            return
        }
        sendJson(response, 200, todo)
        return
    }

    if (request.method === 'DELETE' && pathParts[2] === 'completed' && pathParts.length === 3) {
        await clearCompletedTodos()
        response.writeHead(204)
        response.end()
        return
    }

    if (request.method === 'DELETE' && id && pathParts.length === 3 && isValidId(id)) {
        const removed = await removeTodo(id)
        if (!removed) {
            sendError(response, 404, '任务不存在')
            return
        }
        response.writeHead(204)
        response.end()
        return
    }

    sendError(response, 404, '接口不存在')
}
