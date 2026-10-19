import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthController } from './health.controller.js';
import { loadPgOptions } from './pg/pg.config.js';
import { PgModule } from './pg/pg.module.js';

@Module({
  imports: [
    // cache 避免重复读取环境变量；isGlobal 让业务模块可直接注入 ConfigService。
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    // 异步动态模块保证配置解析完成后才创建唯一的全局连接池。
    PgModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        loadPgOptions({
          DATABASE_URL: config.get<string>('DATABASE_URL'),
          PG_APPLICATION_NAME: config.get<string>('PG_APPLICATION_NAME'),
          PG_POOL_MIN: config.get<string>('PG_POOL_MIN'),
          PG_POOL_MAX: config.get<string>('PG_POOL_MAX'),
          PG_CONNECTION_TIMEOUT_MS: config.get<string>(
            'PG_CONNECTION_TIMEOUT_MS',
          ),
          PG_IDLE_TIMEOUT_MS: config.get<string>('PG_IDLE_TIMEOUT_MS'),
          PG_QUERY_TIMEOUT_MS: config.get<string>('PG_QUERY_TIMEOUT_MS'),
          PG_STATEMENT_TIMEOUT_MS: config.get<string>(
            'PG_STATEMENT_TIMEOUT_MS',
          ),
          PG_SLOW_QUERY_MS: config.get<string>('PG_SLOW_QUERY_MS'),
          PG_SSL: config.get<string>('PG_SSL'),
          PG_SSL_REJECT_UNAUTHORIZED: config.get<string>(
            'PG_SSL_REJECT_UNAUTHORIZED',
          ),
          PG_SSL_CA: config.get<string>('PG_SSL_CA'),
        }),
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
