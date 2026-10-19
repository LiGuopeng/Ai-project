import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post()
  saveHello(): string {
    return this.appService.saveHello();
  }

  @Put()
  updateHello(): string {
    return this.appService.updateHello();
  }

  @Delete('/deleteHello')
  deleteHello(): string {
    return this.appService.deleteHello();
  }
}
