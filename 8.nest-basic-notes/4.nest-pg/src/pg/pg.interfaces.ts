import type { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import type { PoolConfig, QueryResult, QueryResultRow } from 'pg';

// 对外模块配置：继承 pg 原生连接池配置，并增加应用层慢查询阈值。
export interface PgModuleOptions extends PoolConfig {
  slowQueryThresholdMs?: number;
}

export type PgModuleAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Omit<FactoryProvider<PgModuleOptions>, 'provide'>;

export type TransactionIsolationLevel =
  'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE';

export interface TransactionOptions {
  isolationLevel?: TransactionIsolationLevel;
  readOnly?: boolean;
  deferrable?: boolean;
}

// 事务回调只开放 query，防止业务代码手动 release 或结束连接池。
export interface PgTransaction {
  query<Row extends QueryResultRow = QueryResultRow>(
    text: string,
    values?: unknown[],
  ): Promise<QueryResult<Row>>;
}

export interface PgPoolStats {
  idle: number;
  total: number;
  waiting: number;
}
