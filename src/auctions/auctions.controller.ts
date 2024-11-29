import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto, AuctionFiltersDto } from './dto/auction.dto';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { GetUser } from '../users/decorators/get-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AuctionsController {
  constructor(private auctionsService: AuctionsService) {}

  @Post('/create_auction')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createAuction(@Body() dto: CreateAuctionDto, @GetUser('id') userId: string) {
    return this.auctionsService.createAuction(dto, userId);
  }

  @Get('auctions/:id')
  getAuction(@Param('id') id: string) {
    return this.auctionsService.getAuctionById(id);
  }

  @Get('auctions')
  listAuctions(@Query() filters: AuctionFiltersDto) {
    return this.auctionsService.listAuctions(filters);
  }

  @Post('finish_auction/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  endAuction(@Param('id') id: string) {
    return this.auctionsService.endAuction(id);
  }
}
