import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { Bid } from './entities/bid.entity';
import { AuctionsModule } from '../auctions/auctions.module';
import { WebsocketsModule } from 'src/websockets/websockets.module';
import { Auction } from 'src/auctions/entities/auction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bid, Auction]),
    WebsocketsModule,
    forwardRef(() => AuctionsModule),
  ],
  controllers: [BidsController],
  providers: [BidsService],
  exports: [BidsService],
})
export class BidsModule {}
