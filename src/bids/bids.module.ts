import { forwardRef, Module } from '@nestjs/common';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { AuctionsModule } from '../auctions/auctions.module';
import { WebsocketsModule } from '../websockets/websockets.module';
import { RedisModule } from 'src/redis/redis.module';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    WebsocketsModule,
    forwardRef(() => AuctionsModule),
  ],
  controllers: [BidsController],
  providers: [BidsService, JwtService],
  exports: [BidsService],
})
export class BidsModule {}
