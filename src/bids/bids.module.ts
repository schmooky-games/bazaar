import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { Bid } from './entities/bid.entity';
import { AuctionsModule } from '../auctions/auctions.module';
import { Auction } from 'src/auctions/entities/auction.entity';
import { WebsocketsModule } from 'src/websockets/websockets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bid, Auction]),
    AuctionsModule,
    WebsocketsModule,
  ],
  controllers: [BidsController],
  providers: [BidsService],
})
export class BidsModule {}
