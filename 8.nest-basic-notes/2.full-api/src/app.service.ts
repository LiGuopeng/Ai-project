import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  saveHello(): string {
    return 'saveHello';
  }
  updateHello(): string {
    return 'updateHello';
  }
  deleteHello(): string {
    return 'deleteHello';
  }
}
