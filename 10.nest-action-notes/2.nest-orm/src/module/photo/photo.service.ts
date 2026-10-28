import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from '../../entities/Photo.js';
// import { Photo } from '../../entities/Photo.js';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly userRepository: Repository<Photo>,
    // @InjectRepository(Photo)
    // private readonly photoRepository: Repository<Photo>,
  ) {}

  async getHello() {
    // console.log('configService', this.configService.get('database'));
    // const c = await this.userRepository.count();
    const user = await this.userRepository.findAndCount();
    return user;
    // return 'Hello World!' + c;
  }
}
