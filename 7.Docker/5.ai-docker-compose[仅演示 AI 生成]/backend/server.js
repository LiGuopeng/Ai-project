const http = require('node:http');
const { Pool } = require('pg');
const { createClient } = require('redis');

const port = Number(process.env.PORT || 3000);
const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});
const redis = createClient({ url: process.env.REDIS_URL });

redis.on('error', (error) => console.error('Redis error:', error.message));

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

async function health() {
  const database = await pool.query('SELECT NOW() AS time');
  const cache = await redis.ping();
  return { status: 'ok', postgres: database.rows[0].time, redis: cache };
}

const server = http.createServer(async (request, response) => {
  if (request.url === '/api/health') {
    try {
      sendJson(response, 200, await health());
    } catch (error) {
      sendJson(response, 503, { status: 'error', message: error.message });
    }
    return;
  }

  if (request.url === '/api/hello') {
    sendJson(response, 200, {
      message: 'Node API is running',
      services: ['postgres', 'redis'],
    });
    return;
  }

  sendJson(response, 404, { message: 'Not found' });
});

async function start() {
  await redis.connect();
  await pool.query('SELECT 1');
  server.listen(port, '0.0.0.0', () => {
    console.log(`API is running on port ${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start API:', error.message);
  process.exit(1);
});
