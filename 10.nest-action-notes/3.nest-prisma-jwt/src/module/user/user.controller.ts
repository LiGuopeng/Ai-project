import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('hello')
  getHello() {
    return this.userService.getHello();
  }

  @Post('save')
  saveHello() {
    return this.userService.saveHello();
  }
}
