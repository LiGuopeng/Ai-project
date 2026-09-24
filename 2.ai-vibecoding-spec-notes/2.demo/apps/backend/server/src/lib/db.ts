import pg from 'pg'

import { config } from './config'

const globalForDb = globalThis as unknown as { todoPool?: pg.Pool }

export const pool =
    globalForDb.todoPool ??
    new pg.Pool({
        ...config.database,
        max: 10,
    })

if (process.env.NODE_ENV !== 'production') {
    globalForDb.todoPool = pool
}

export async function ensureSchema() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
            id UUID PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `)
}
