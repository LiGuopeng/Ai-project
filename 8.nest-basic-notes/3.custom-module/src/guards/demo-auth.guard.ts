import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

/** 通过请求头演示守卫的鉴权流程。 */
@Injectable()
export class DemoAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.header('x-demo-token');

    if (token !== 'nest-demo') {
      throw new UnauthorizedException('缺少有效的 x-demo-token');
    }

    return true;
  }
}
