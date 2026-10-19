import { ServiceUnavailableException } from '@nestjs/common';
import { HealthController } from './health.controller.js';
import type { PgService } from './pg/pg.service.js';

describe('HealthController', () => {
  const ping = vi.fn();
  const getPoolStats = vi.fn();
  const controller = new HealthController({
    ping,
    getPoolStats,
  } as unknown as PgService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reports database readiness', async () => {
    ping.mockResolvedValue(3);
    getPoolStats.mockReturnValue({ idle: 1, total: 2, waiting: 0 });

    await expect(controller.ready()).resolves.toEqual({
      status: 'ok',
      database: {
        latencyMs: 3,
        pool: { idle: 1, total: 2, waiting: 0 },
      },
    });
  });

  it('returns 503 when PostgreSQL is unavailable', async () => {
    ping.mockRejectedValue(new Error('connection refused'));

    await expect(controller.ready()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
