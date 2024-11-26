import { createId } from '@paralleldrive/cuid2';
import { Entity, Column, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn('varchar', { length: 32 })
  id: string = createId();

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  createdAt: Date;
}
