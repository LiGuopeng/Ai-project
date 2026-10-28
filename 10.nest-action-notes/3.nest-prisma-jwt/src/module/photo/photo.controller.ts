import { Controller, Get } from '@nestjs/common';
import { PhotoService } from './photo.service.js';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Get()
  getHello() {
    return this.photoService.getHello();
  }
}
