import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/config/base/base.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  // @OneToMany(() => Task, (task: Task) => task.user)
  // tasks: Relation<Task[]>;
}
