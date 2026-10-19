import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { PgService } from './pg/pg.service.js';

interface ReadinessResponse {
  status: 'ok';
  database: {
    latencyMs: number;
    pool: {
      idle: number;
      total: number;
      waiting: number;
    };
  };
}

@Controller('health')
export class HealthController {
  constructor(private readonly pg: PgService) {}

  @Get('live')
  live(): { status: 'ok' } {
    // 存活探针只判断 Node 进程是否还能响应，不访问外部依赖。
    return { status: 'ok' };
  }

  @Get('ready')
  async ready(): Promise<ReadinessResponse> {
    try {
      // 就绪探针校验数据库；失败返回 503，让网关停止向本实例分发流量。
      return {
        status: 'ok',
        database: {
          latencyMs: await this.pg.ping(),
          pool: this.pg.getPoolStats(),
        },
      };
    } catch {
      throw new ServiceUnavailableException('Database is unavailable');
    }
  }
}
