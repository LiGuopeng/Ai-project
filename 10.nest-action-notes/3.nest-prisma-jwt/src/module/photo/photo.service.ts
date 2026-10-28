import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class PhotoService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello() {
    // include user 相当于 TypeORM 查询时级联查出关联对象
    return this.prisma.photo.findMany({
      include: {
        user: true,
      },
    });
  }
}
