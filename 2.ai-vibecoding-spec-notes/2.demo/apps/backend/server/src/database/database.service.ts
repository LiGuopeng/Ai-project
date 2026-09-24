import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Pool, type QueryResultRow } from 'pg'

import { config } from '../config/config'

@Injectable()
export class DatabaseService implements OnModuleDestroy, OnModuleInit {
    private readonly pool = new Pool({
        ...config.database,
        max: 10,
    })

    async onModuleInit() {
        await this.pool.query(`
            CREATE TABLE IF NOT EXISTS todos (
                id UUID PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                completed BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `)
    }

    async onModuleDestroy() {
        await this.pool.end()
    }

    query<T extends QueryResultRow>(text: string, values?: unknown[]) {
        return this.pool.query<T>(text, values)
    }
}
