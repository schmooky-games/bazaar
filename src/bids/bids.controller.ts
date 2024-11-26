import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { BidsService } from './bids.service';
import { PlaceBidDto } from './dto/bid.dto';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { GetUser } from '../users/decorators/get-user.decorator';

@Controller('bids')
export class BidsController {
  constructor(private bidService: BidsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  placeBid(@Body() dto: PlaceBidDto, @GetUser('id') userId: string) {
    return this.bidService.placeBid(dto, userId);
  }

  @Get('auction/:auctionId')
  getBidsForAuction(@Param('auctionId') auctionId: string) {
    return this.bidService.getBidsForAuction(auctionId);
  }
}
