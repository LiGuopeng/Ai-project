import { createServer } from 'node:http'

import { config } from './config'
import { initializeDatabase } from './database'
import { handleTodoRequest } from './modules/todos/todo.controller'

const server = createServer(async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')

    if (request.method === 'OPTIONS') {
        response.writeHead(204)
        response.end()
        return
    }

    try {
        const pathname = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`).pathname
        if (request.method === 'GET' && pathname === '/api/health') {
            response.writeHead(200, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify({ status: 'ok' }))
            return
        }
        if (pathname.startsWith('/api/todos')) {
            await handleTodoRequest(request, response, pathname)
            return
        }
        response.writeHead(404, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ message: '接口不存在' }))
    } catch (error) {
        console.error(error)
        response.writeHead(500, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ message: '服务暂时不可用' }))
    }
})

async function bootstrap() {
    await initializeDatabase()
    server.listen(config.port, () => {
        console.log(`Todo API listening on http://localhost:${config.port}`)
    })
}

void bootstrap()
