import type { PgModuleOptions } from './pg.interfaces.js';

type PgEnvironment = Partial<
  Record<
    | 'DATABASE_URL'
    | 'PG_APPLICATION_NAME'
    | 'PG_POOL_MIN'
    | 'PG_POOL_MAX'
    | 'PG_CONNECTION_TIMEOUT_MS'
    | 'PG_IDLE_TIMEOUT_MS'
    | 'PG_QUERY_TIMEOUT_MS'
    | 'PG_STATEMENT_TIMEOUT_MS'
    | 'PG_SLOW_QUERY_MS'
    | 'PG_SSL'
    | 'PG_SSL_REJECT_UNAUTHORIZED'
    | 'PG_SSL_CA',
    string
  >
>;

export function loadPgOptions(env: PgEnvironment): PgModuleOptions {
  // 线上只接收统一连接串，避免把用户名、密码散落在源码和多个配置项中。
  const connectionString = env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }

  const min = readInteger(env.PG_POOL_MIN, 'PG_POOL_MIN', 2, 0);
  const max = readInteger(env.PG_POOL_MAX, 'PG_POOL_MAX', 20, 1);
  if (min > max) {
    throw new Error('PG_POOL_MIN cannot be greater than PG_POOL_MAX');
  }

  const sslEnabled = readBoolean(env.PG_SSL, 'PG_SSL', false);
  const rejectUnauthorized = readBoolean(
    env.PG_SSL_REJECT_UNAUTHORIZED,
    'PG_SSL_REJECT_UNAUTHORIZED',
    true,
  );

  return {
    connectionString,
    application_name: env.PG_APPLICATION_NAME?.trim() || 'nest-pg',
    min,
    max,
    // 连接、查询和服务端语句三层超时，防止请求无限占用连接。
    connectionTimeoutMillis: readInteger(
      env.PG_CONNECTION_TIMEOUT_MS,
      'PG_CONNECTION_TIMEOUT_MS',
      5_000,
      1,
    ),
    idleTimeoutMillis: readInteger(
      env.PG_IDLE_TIMEOUT_MS,
      'PG_IDLE_TIMEOUT_MS',
      30_000,
      1,
    ),
    query_timeout: readInteger(
      env.PG_QUERY_TIMEOUT_MS,
      'PG_QUERY_TIMEOUT_MS',
      10_000,
      1,
    ),
    statement_timeout: readInteger(
      env.PG_STATEMENT_TIMEOUT_MS,
      'PG_STATEMENT_TIMEOUT_MS',
      10_000,
      1,
    ),
    slowQueryThresholdMs: readInteger(
      env.PG_SLOW_QUERY_MS,
      'PG_SLOW_QUERY_MS',
      500,
      1,
    ),
    keepAlive: true,
    // 生产环境建议开启 SSL，并使用 CA 验证数据库服务端证书。
    ssl: sslEnabled
      ? {
          rejectUnauthorized,
          ...(env.PG_SSL_CA
            ? { ca: env.PG_SSL_CA.replaceAll('\\n', '\n') }
            : {}),
        }
      : false,
  };
}

function readInteger(
  value: string | undefined,
  name: string,
  fallback: number,
  minimum: number,
): number {
  if (value === undefined || value.trim() === '') {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum) {
    throw new Error(
      `${name} must be an integer greater than or equal to ${minimum}`,
    );
  }

  return parsed;
}

function readBoolean(
  value: string | undefined,
  name: string,
  fallback: boolean,
): boolean {
  if (value === undefined || value.trim() === '') {
    return fallback;
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }

  throw new Error(`${name} must be true or false`);
}
