import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuctionsModule } from './auctions/auctions.module';
import { BidsModule } from './bids/bids.module';
import { JwtModule } from '@nestjs/jwt';
import { WebsocketsModule } from './websockets/websockets.module';
import { MailModule } from './mail/mail.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { CustomLoggerService } from './logger/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        synchronize: false,
        logging: true,
        autoLoadEntities: true,
      }),
    }),
    WinstonModule.forRootAsync({
      useFactory: () => ({
        // options
      }),
      inject: [],
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    UsersModule,
    AuctionsModule,
    BidsModule,
    WebsocketsModule,
    MailModule,
  ],
  providers: [],
})
export class AppModule {}
