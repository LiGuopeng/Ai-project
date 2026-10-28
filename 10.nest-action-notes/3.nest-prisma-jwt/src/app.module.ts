import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './module/user/user.module';
import { PhotoModule } from './module/photo/photo.module';
import { AuthModule } from './module/auth/auth.module';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.example'],
    }),
    // Prisma 的连接信息通过 .env 中的 DATABASE_URL 提供
    // 对应 2.nest-orm 中的 TypeOrmModule.forRoot
    PrismaModule,
    UserModule,
    PhotoModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
