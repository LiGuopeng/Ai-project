import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      // 从 Authorization: Bearer <token> 请求头中提取 token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 校验签名的密钥，需与签发时（JwtModule.register）的一致
      secretOrKey: process.env.JWT_SECRET ?? 'lgp-dev-secret',
    });
  }

  // payload 就是签进 token 里的内容: { sub, name, iat, exp }
  // 返回值会挂载到 req.user 上
  async validate(payload: { sub: number; name: string }) {
    return this.authService.findUser(payload.sub);
  }
}
