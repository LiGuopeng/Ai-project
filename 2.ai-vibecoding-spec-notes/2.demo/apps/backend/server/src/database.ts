import pg from 'pg'

import { config } from './config'

export const pool = new pg.Pool(config.database)

export async function initializeDatabase() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
            id UUID PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `)
}
