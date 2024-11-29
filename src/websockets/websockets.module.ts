import { Module } from '@nestjs/common';
import { BidsGateway } from './bids.gateway';
import { CustomLoggerService } from 'src/logger/logger.service';

@Module({
  providers: [BidsGateway, CustomLoggerService],
  exports: [BidsGateway],
})
export class WebsocketsModule {}
