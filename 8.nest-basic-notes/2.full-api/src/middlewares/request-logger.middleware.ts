import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import type { NestMiddleware } from '@nestjs/common';

/** 记录请求信息，并为每次请求生成唯一的追踪 ID。 */
export class RequestLoggerMiddleware implements NestMiddleware {
  /** 记录请求信息，并为每次请求生成唯一的追踪 ID。 */
  use(request: Request, response: Response, next: NextFunction): void {
    const requestId = randomUUID();
    const startedAt = performance.now();

    // 返回给客户端，便于根据响应头追踪请求。
    response.setHeader('X-Request-Id', requestId);

    // 响应结束后记录状态码、耗时和请求 ID。
    response.on('finish', () => {
      const duration = Math.round(performance.now() - startedAt);
      console.log(
        `[HTTP-----] ${request.method} ${request.originalUrl} ${response.statusCode} ${duration}ms requestId=${requestId}`,
      );
    });

    next();
  }
}
