import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Auction } from '../../auctions/entities/auction.entity';
import { createId } from '@paralleldrive/cuid2';

@Entity()
export class Bid {
  @PrimaryColumn('varchar', { length: 32 })
  id: string = createId();

  @Column()
  amount: number;

  @Column()
  placedAt: Date;

  @ManyToOne(() => Auction, (auction) => auction.id)
  auction: Auction;

  @ManyToOne(() => User, (user) => user.id)
  bidder: User;
}
