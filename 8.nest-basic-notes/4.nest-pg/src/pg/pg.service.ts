import {
  Inject,
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import type { Pool, QueryResult, QueryResultRow } from 'pg';
import { PG_MODULE_OPTIONS, PG_POOL } from './pg.constants.js';
import type {
  PgModuleOptions,
  PgPoolStats,
  PgTransaction,
  TransactionOptions,
} from './pg.interfaces.js';

@Injectable()
export class PgService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PgService.name);
  private readonly slowQueryThresholdMs: number;
  private closing = false;

  private readonly onPoolError = (error: Error): void => {
    this.logger.error('Idle PostgreSQL client emitted an error', error.stack);
  };

  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    @Inject(PG_MODULE_OPTIONS) options: PgModuleOptions,
  ) {
    this.slowQueryThresholdMs = options.slowQueryThresholdMs ?? 500;
  }

  async onModuleInit(): Promise<void> {
    // 启动阶段立即探测数据库，连接失败时阻止应用带病上线。
    this.pool.on('error', this.onPoolError);
    await this.ping();
    this.logger.log('PostgreSQL connection pool is ready');
  }

  async onModuleDestroy(): Promise<void> {
    if (this.closing) {
      return;
    }

    // Nest 收到 SIGTERM 后会执行这里，等待连接池关闭再退出进程。
    this.closing = true;
    this.pool.off('error', this.onPoolError);
    await this.pool.end();
    this.logger.log('PostgreSQL connection pool closed');
  }

  async query<Row extends QueryResultRow = QueryResultRow>(
    text: string,
    values: unknown[] = [],
  ): Promise<QueryResult<Row>> {
    this.assertOpen();
    const startedAt = performance.now();

    try {
      // values 必须单独传递，业务层不要拼接用户输入，避免 SQL 注入。
      return await this.pool.query<Row>(text, values);
    } catch (error: unknown) {
      const durationMs = Math.round(performance.now() - startedAt);
      this.logger.error(
        `PostgreSQL query failed after ${durationMs}ms${formatErrorCode(error)}`,
      );
      throw error;
    } finally {
      const durationMs = Math.round(performance.now() - startedAt);
      if (durationMs >= this.slowQueryThresholdMs) {
        this.logger.warn(`Slow PostgreSQL query detected: ${durationMs}ms`);
      }
    }
  }

  async withTransaction<Result>(
    work: (transaction: PgTransaction) => Promise<Result>,
    options: TransactionOptions = {},
  ): Promise<Result> {
    this.assertOpen();
    // 先校验事务选项，再从池中申请连接，避免无效配置占用连接。
    const beginStatement = buildBeginStatement(options);
    const client = await this.pool.connect();
    const transaction: PgTransaction = {
      query: <Row extends QueryResultRow = QueryResultRow>(
        text: string,
        values: unknown[] = [],
      ) => client.query<Row>(text, values),
    };
    let transactionStarted = false;
    let releaseError: Error | undefined;

    try {
      await client.query(beginStatement);
      transactionStarted = true;

      // 同一回调中的所有查询固定使用同一条数据库连接。
      const result = await work(transaction);
      await client.query('COMMIT');
      return result;
    } catch (error: unknown) {
      if (transactionStarted) {
        // 业务抛错必须回滚；回滚失败时销毁该连接，避免污染连接池。
        try {
          await client.query('ROLLBACK');
        } catch (rollbackError: unknown) {
          releaseError = toError(rollbackError);
          this.logger.error(
            'PostgreSQL transaction rollback failed',
            releaseError.stack,
          );
        }
      }
      throw error;
    } finally {
      client.release(releaseError);
    }
  }

  async ping(): Promise<number> {
    // SELECT 1 不依赖业务表，适合作为数据库就绪探针。
    const startedAt = performance.now();
    await this.query('SELECT 1');
    return Math.round(performance.now() - startedAt);
  }

  getPoolStats(): PgPoolStats {
    return {
      idle: this.pool.idleCount,
      total: this.pool.totalCount,
      waiting: this.pool.waitingCount,
    };
  }

  private assertOpen(): void {
    if (this.closing) {
      throw new Error('PostgreSQL connection pool is shutting down');
    }
  }
}

function buildBeginStatement(options: TransactionOptions): string {
  const isolationLevel = options.isolationLevel ?? 'READ COMMITTED';
  const accessMode = options.readOnly ? 'READ ONLY' : 'READ WRITE';
  const deferrable = options.deferrable ? 'DEFERRABLE' : 'NOT DEFERRABLE';

  if (
    options.deferrable &&
    (!options.readOnly || isolationLevel !== 'SERIALIZABLE')
  ) {
    throw new Error(
      'DEFERRABLE transactions must be SERIALIZABLE and READ ONLY',
    );
  }

  return `BEGIN ISOLATION LEVEL ${isolationLevel} ${accessMode} ${deferrable}`;
}

function formatErrorCode(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return ` (code=${String(error.code)})`;
  }
  return '';
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}
