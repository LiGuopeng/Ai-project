import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './User';

// 对象实体
@Entity()
export class Photo {
  // Photo -> photo
  @PrimaryColumn({
    type: 'int', // 在数据库表字段类型是 int，并且这个字段是自增长
    generated: true,
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 80,
  })
  url: string;

  @ManyToOne('User', (user: User) => user.photos)
  user: User;
}
