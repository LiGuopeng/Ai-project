import 'reflect-metadata'

import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { config } from './config/config'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.setGlobalPrefix('api')
    app.useGlobalPipes(
        new ValidationPipe({
            forbidNonWhitelisted: true,
            transform: true,
            whitelist: true,
        })
    )

    await app.listen(config.app.port, config.app.host)
}

void bootstrap()
