import { forwardRef, Module } from '@nestjs/common';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';
import { WebsocketsModule } from '../websockets/websockets.module';
import { BidsModule } from '../bids/bids.module';
import { RedisModule } from 'src/redis/redis.module';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    WebsocketsModule,
    forwardRef(() => BidsModule),
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService, JwtService],
  exports: [AuctionsService],
})
export class AuctionsModule {}
