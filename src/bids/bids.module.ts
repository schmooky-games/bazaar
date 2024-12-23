import { forwardRef, Module } from '@nestjs/common';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { AuctionsModule } from '../auctions/auctions.module';
import { WebsocketsModule } from '../websockets/websockets.module';
import { RedisModule } from 'src/redis/redis.module';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    WebsocketsModule,
    forwardRef(() => AuctionsModule),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get('KAFKA_CLIENT_ID'),
              brokers: [configService.get('KAFKA_BROKER_URL')],
            },
            consumer: {
              groupId: configService.get('KAFKA_CONSUMER_GROUP'),
            },
          },
        }),
      },
    ]),
  ],
  controllers: [BidsController],
  providers: [BidsService, JwtService],
  exports: [BidsService],
})
export class BidsModule {}
