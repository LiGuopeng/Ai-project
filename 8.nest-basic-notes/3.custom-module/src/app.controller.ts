import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  BadRequestException,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import type { Detail } from './app.service.js';
import { DemoAuthGuard } from './guards/demo-auth.guard.js';
import { ResponseTransformInterceptor } from './interceptors/response-transform.interceptor.js';
import { ParsePositiveIntPipe } from './pipes/parse-positive-int.pipe.js';

@Controller('guopeng')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Promise<Detail[]> {
    return this.appService.getHello();
  }

  @Post('details')
  createDetail(@Body() body: { name: string; age?: string }): Promise<Detail> {
    return this.appService.createDetail(body.name, body.age);
  }

  @Get('details')
  findAllDetails(): Promise<Detail[]> {
    return this.appService.findAllDetails();
  }

  @Get('details/:name')
  findDetail(@Param('name') name: string): Promise<Detail> {
    return this.appService.findDetail(name);
  }

  @Put('details/:name')
  updateDetail(
    @Param('name') currentName: string,
    @Body() body: { name: string; age?: string },
  ): Promise<Detail> {
    return this.appService.updateDetail(currentName, body.name, body.age);
  }

  @Delete('details/:name')
  deleteDetail(@Param('name') name: string): Promise<Detail> {
    return this.appService.deleteDetail(name);
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
}
