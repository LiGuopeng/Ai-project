import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from '../../entities/Photo.js';
import { PhotoController } from './photo.controller.js';
import { PhotoService } from './photo.service.js';

// export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [TypeOrmModule.forFeature([Photo])],
  controllers: [PhotoController],
  providers: [PhotoService],
})
export class PhotoModule {}
