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

@Controller('auctions')
export class AuctionsController {
  constructor(private auctionsService: AuctionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createAuction(@Body() dto: CreateAuctionDto, @GetUser('id') userId: string) {
    return this.auctionsService.createAuction(dto, userId);
  }

  @Get(':id')
  getAuction(@Param('id') id: string) {
    return this.auctionsService.getAuctionById(id);
  }

  @Get()
  listAuctions(@Query() filters: AuctionFiltersDto) {
    return this.auctionsService.listAuctions(filters);
  }

  @Post(':id/end')
  @UseGuards(JwtAuthGuard)
  endAuction(@Param('id') id: string) {
    return this.auctionsService.endAuction(id);
  }
}
