import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  // 注册 SIGTERM/SIGINT 钩子，使 PgService 能优雅关闭连接池。
  app.enableShutdownHooks();

  const port = parsePort(process.env.PORT);
  await app.listen(port, '0.0.0.0');
  Logger.log(`Application listening on port ${port}`, 'Bootstrap');
}

function parsePort(value: string | undefined): number {
  const port = Number(value ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }
  return port;
}

await bootstrap();
