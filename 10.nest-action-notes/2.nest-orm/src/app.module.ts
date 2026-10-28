import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '../config/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserModule } from './module/user/user.module';
import { PhotoModule } from './module/photo/photo.module';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.example'],
      load: [databaseConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      database: 'postgres',
      username: 'lgp',
      password: 'lgp',
      // 最关键的配置
      // 对象关系映射的实体对象所在位置
      entities: [join(__dirname, 'entities', '*{.ts,.js}')],
      // 是否自动将对象属性映射为数据库表字段
      synchronize: true,
    }),
    UserModule,
    PhotoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
