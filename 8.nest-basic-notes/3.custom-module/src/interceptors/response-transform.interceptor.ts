import {
  CallHandler,
  ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { map, type Observable } from 'rxjs';
import type { Response } from 'express';

/** 演示拦截器如何在控制器执行前后处理请求和响应。 */
@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse<Response>();
    const startedAt = performance.now();

    console.log('[Interceptor] 控制器执行前');
    response.setHeader('X-Interceptor', 'response-transform');

    return next.handle().pipe(
      map((data: unknown) => {
        const duration = Math.round(performance.now() - startedAt);
        console.log(`[Interceptor] 控制器执行后 ${duration}ms`);

        return {
          code: 0,
          message: 'success',
          data,
          duration,
        };
      }),
    );
  }
}
