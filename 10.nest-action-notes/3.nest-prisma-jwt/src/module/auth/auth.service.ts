import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // 校验用户名密码（演示用明文比对，正式项目密码要存哈希）
  async validateUser(name: string, password: string) {
    // name 字段在 schema 中不是唯一约束，所以用 findFirst 而不是 findUnique
    const user = await this.prisma.user.findFirst({ where: { name } });
    if (!user || user.password !== password) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return user;
  }

  async login(name: string, password: string) {
    const user = await this.validateUser(name, password);
    // 签进 token 的内容，尽量精简，只带身份标识
    const payload = { sub: user.id, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findUser(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, status: true },
    });
  }
}
