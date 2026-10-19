import { loadPgOptions } from './pg.config.js';

describe('loadPgOptions', () => {
  it('builds safe defaults', () => {
    const options = loadPgOptions({
      DATABASE_URL: 'postgres://user:secret@localhost/app',
    });

    expect(options).toMatchObject({
      max: 20,
      min: 2,
      connectionTimeoutMillis: 5_000,
      query_timeout: 10_000,
      statement_timeout: 10_000,
      ssl: false,
    });
  });

  it('requires a database URL', () => {
    expect(() => loadPgOptions({})).toThrow('DATABASE_URL is required');
  });

  it('rejects an invalid pool range', () => {
    expect(() =>
      loadPgOptions({
        DATABASE_URL: 'postgres://localhost/app',
        PG_POOL_MIN: '10',
        PG_POOL_MAX: '5',
      }),
    ).toThrow('PG_POOL_MIN cannot be greater than PG_POOL_MAX');
  });

  it('enables verified TLS', () => {
    const options = loadPgOptions({
      DATABASE_URL: 'postgres://localhost/app',
      PG_SSL: 'true',
      PG_SSL_CA: 'line1\\nline2',
    });

    expect(options.ssl).toEqual({
      rejectUnauthorized: true,
      ca: 'line1\nline2',
    });
  });
});
