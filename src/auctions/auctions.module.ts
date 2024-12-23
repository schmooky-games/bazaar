import { forwardRef, Module } from '@nestjs/common';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';
import { WebsocketsModule } from '../websockets/websockets.module';
import { BidsModule } from '../bids/bids.module';
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
    forwardRef(() => BidsModule),
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
  controllers: [AuctionsController],
  providers: [AuctionsService, JwtService],
  exports: [AuctionsService],
})
export class AuctionsModule {}
