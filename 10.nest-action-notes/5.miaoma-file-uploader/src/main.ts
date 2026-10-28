import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const uploadDirectory = join(process.cwd(), 'uploads');

  mkdirSync(uploadDirectory, { recursive: true });
  app.useStaticAssets(uploadDirectory, { prefix: '/uploads' });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
