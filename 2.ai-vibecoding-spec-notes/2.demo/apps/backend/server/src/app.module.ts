import { Module } from '@nestjs/common'

import { DatabaseModule } from './database/database.module'
import { HealthModule } from './health/health.module'
import { TodoModule } from './modules/todos/todo.module'

@Module({
    imports: [DatabaseModule, HealthModule, TodoModule],
})
export class AppModule {}
