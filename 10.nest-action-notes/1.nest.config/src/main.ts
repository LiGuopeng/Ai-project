import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 从环境变量中获取端口号，默认值为3000
  // 多环境运行
  const port = process.env.PORT ?? 3000;

  await app.listen(port);
  console.log(`Application is running on: ${port}`);
}
bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
