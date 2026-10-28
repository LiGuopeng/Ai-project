import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello() {
    const c = await this.prisma.user.count();
    console.log('user count:', String(c));
    return 'Hello World!' + c;
  }

  async saveHello() {
    return this.prisma.user.create({
      data: {
        name: 'hjaha',
        password: 'xxx',
        status: true,
      },
    });
  }
}
