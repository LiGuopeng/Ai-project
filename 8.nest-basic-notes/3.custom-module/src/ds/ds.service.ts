import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool, type QueryResult, type QueryResultRow } from 'pg';

const dsConfig = {
  user: 'lgp',
  host: '127.0.0.1',
  database: 'postgres',
  password: 'lgp',
  port: 5432,
};

// nest 对于完整模块和服务有完整的生命周期管理
// 实现OnModuleInit和OnModuleDestroy接口，实现onModuleInit和onModuleDestroy方法
@Injectable()
export class DsService implements OnModuleInit, OnModuleDestroy {
  private readonly pool = new Pool(dsConfig);

  query<Row extends QueryResultRow = QueryResultRow>(
    sql: string,
    values: unknown[] = [],
  ): Promise<QueryResult<Row>> {
    return this.pool.query<Row>(sql, values);
  }

  //   模块初始化的时候，连接数据库
  async onModuleInit(): Promise<void> {
    const client = await this.pool.connect();
    client.release();
    console.log('ds service onModuleInit');
  }

  //   模块销毁的时候，断开数据库连接
  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
    console.log('ds service onModuleDestroy');
  }
}
