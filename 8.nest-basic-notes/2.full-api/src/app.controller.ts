import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller('guopeng')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get(':id')
  getHelloDetail(
    @Param('id') id: string,
    @Query('name') name: string,
    @Body() body: any,
  ): string {
    console.log('🚀 ~ AppController ~ getHelloDetail ~ id:', id, name, body);

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
