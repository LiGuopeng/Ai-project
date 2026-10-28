import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../entities/User.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from '../../entities/Photo.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {}

  async getHello() {
    // console.log('configService', this.configService.get('database'));
    const c = await this.userRepository.count();
    console.log('user count:', String(c));
    return 'Hello World!' + c;
  }

  async saveHello() {
    const user = new User();
    user.id = 111;
    user.name = 'hjaha';
    user.password = 'xxx';
    user.status = true;
    await this.userRepository.save(user);
  }
}
