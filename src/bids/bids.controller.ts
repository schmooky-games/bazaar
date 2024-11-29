import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { BidsService } from './bids.service';
import { PlaceBidDto } from './dto/bid.dto';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { GetUser } from '../users/decorators/get-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class BidsController {
  constructor(private bidService: BidsService) {}

  @Post('place_bid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  placeBid(@Body() dto: PlaceBidDto, @GetUser('id') userId: string) {
    return this.bidService.placeBid(dto, userId);
  }

  @Get('bids/:auctionId')
  getBidsForAuction(@Param('auctionId') auctionId: string) {
    return this.bidService.getBidsForAuction(auctionId);
  }
}
