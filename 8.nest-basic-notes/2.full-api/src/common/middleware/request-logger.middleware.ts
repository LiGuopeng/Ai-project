import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import type { NestMiddleware } from '@nestjs/common';

export class RequestLoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const requestId = randomUUID();
    const startedAt = performance.now();

    response.setHeader('X-Request-Id', requestId);

    response.on('finish', () => {
      const duration = Math.round(performance.now() - startedAt);
      console.log(
        `[HTTP] ${request.method} ${request.originalUrl} ${response.statusCode} ${duration}ms requestId=${requestId}`,
      );
    });

    next();
  }
}
