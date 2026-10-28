import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { name: string; password: string }) {
    return this.authService.login(body.name, body.password);
  }

  // 受保护的接口：不带 token 或 token 无效会返回 401
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    // req.user 来自 JwtStrategy.validate 的返回值
    return req.user;
  }
}
