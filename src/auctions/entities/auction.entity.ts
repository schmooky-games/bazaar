import {
  Entity,
  Column,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { createId } from '@paralleldrive/cuid2';

@Entity()
export class Auction {
  @PrimaryColumn('varchar', { length: 32 })
  id: string = createId();

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  startingPrice: number;

  @Column()
  currentPrice: number;

  @Column()
  endDate: Date;

  @ManyToOne(() => User, (user) => user.id)
  seller: User;
}
