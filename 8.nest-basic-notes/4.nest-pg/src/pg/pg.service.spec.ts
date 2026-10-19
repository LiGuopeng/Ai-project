import type { Pool, PoolClient, QueryResult } from 'pg';
import { PgService } from './pg.service.js';

describe('PgService', () => {
  const poolQuery = vi.fn();
  const poolConnect = vi.fn();
  const pool = {
    query: poolQuery,
    connect: poolConnect,
    on: vi.fn(),
    off: vi.fn(),
    end: vi.fn(),
    idleCount: 2,
    totalCount: 3,
    waitingCount: 1,
  } as unknown as Pool;
  let service: PgService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new PgService(pool, { slowQueryThresholdMs: 1_000 });
  });

  it('runs parameterized queries through the pool', async () => {
    const result = queryResult([{ id: 1 }]);
    poolQuery.mockResolvedValue(result);

    await expect(service.query('SELECT $1::int AS id', [1])).resolves.toBe(
      result,
    );
  });

  it('commits a successful transaction and releases the client', async () => {
    const { client, query, release } = mockClient();
    poolConnect.mockResolvedValue(client);

    await expect(
      service.withTransaction(async (transaction) => {
        await transaction.query('INSERT INTO example VALUES ($1)', [1]);
        return 'done';
      }),
    ).resolves.toBe('done');

    expect(query).toHaveBeenNthCalledWith(
      1,
      'BEGIN ISOLATION LEVEL READ COMMITTED READ WRITE NOT DEFERRABLE',
    );
    expect(query).toHaveBeenLastCalledWith('COMMIT');
    expect(release).toHaveBeenCalledOnce();
  });

  it('rolls back and releases the client when work fails', async () => {
    const { client, query, release } = mockClient();
    poolConnect.mockResolvedValue(client);

    await expect(
      service.withTransaction(() => Promise.reject(new Error('failed'))),
    ).rejects.toThrow('failed');

    expect(query).toHaveBeenLastCalledWith('ROLLBACK');
    expect(release).toHaveBeenCalledOnce();
  });

  it('rejects invalid deferrable transaction options', async () => {
    await expect(
      service.withTransaction(async () => undefined, { deferrable: true }),
    ).rejects.toThrow(
      'DEFERRABLE transactions must be SERIALIZABLE and READ ONLY',
    );
    expect(poolConnect).not.toHaveBeenCalled();
  });
});

function mockClient(): {
  client: PoolClient;
  query: ReturnType<typeof vi.fn>;
  release: ReturnType<typeof vi.fn>;
} {
  const query = vi.fn().mockResolvedValue(queryResult([]));
  const release = vi.fn();
  return {
    client: { query, release } as unknown as PoolClient,
    query,
    release,
  };
}

function queryResult<Row extends Record<string, unknown>>(
  rows: Row[],
): QueryResult<Row> {
  return {
    command: 'SELECT',
    rowCount: rows.length,
    oid: 0,
    fields: [],
    rows,
  };
}
