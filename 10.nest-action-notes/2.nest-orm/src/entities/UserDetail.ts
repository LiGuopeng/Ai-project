import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './User.js';

// 对象实体
@Entity('userdetail')
export class UserDetail {
  // User -> user
  @PrimaryColumn({
    type: 'int', // 在数据库表字段类型是 int，并且这个字段是自增长
    generated: true,
  })
  id: number;

  @Column({
    type: 'jsonb',
  })
  hobby: string[];

  @Column({
    type: 'bool',
  })
  status: boolean;

  @OneToOne(() => User, (user) => user.id)
  user: User;
}
