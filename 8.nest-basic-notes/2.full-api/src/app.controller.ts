import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  BadRequestException,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import { DemoAuthGuard } from './guards/demo-auth.guard.js';
import { ResponseTransformInterceptor } from './interceptors/response-transform.interceptor.js';
import { ParsePositiveIntPipe } from './pipes/parse-positive-int.pipe.js';

@Controller('guopeng')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('filter-demo')
  getFilterDemo(): never {
    throw new BadRequestException('这是一个异常过滤器示例');
  }

  @Get('pipe-demo/:id')
  getPipeDemo(@Param('id', ParsePositiveIntPipe) id: number): string {
    return `Pipe 转换后的 id: ${id}`;
  }

  @UseGuards(DemoAuthGuard)
  @Get('guard-demo')
  getGuardDemo(): string {
    return 'Guard 校验通过';
  }

  @UseInterceptors(ResponseTransformInterceptor)
  @Get('interceptor-demo')
  getInterceptorDemo(): string {
    return '这是 Controller 返回的数据';
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
