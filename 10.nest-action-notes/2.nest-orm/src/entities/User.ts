import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Photo } from './Photo';

// 对象实体
@Entity()
export class User {
  // User -> user
  @PrimaryColumn({
    type: 'int', // 在数据库表字段类型是 int，并且这个字段是自增长
    generated: true,
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 20,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  password: string;

  @Column({
    type: 'bool',
  })
  status: boolean;

  @OneToMany('Photo', (photo: Photo) => photo.user)
  photos: Photo[];
}
