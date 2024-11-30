import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';
import { Auction } from './entities/auction.entity';
import { User } from '../users/entities/user.entity';
import { WebsocketsModule } from '../websockets/websockets.module';
import { BidsModule } from '../bids/bids.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auction, User]),
    WebsocketsModule,
    forwardRef(() => BidsModule),
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService],
  exports: [AuctionsService],
})
export class AuctionsModule {}
