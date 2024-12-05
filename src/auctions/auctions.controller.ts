import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto, AuctionFiltersDto } from './dto/auction.dto';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { GetUser } from '../users/decorators/get-user.decorator';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Auction } from './entities/auction.entity';

@Controller('auctions')
export class AuctionsController {
  constructor(private auctionsService: AuctionsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createAuction(@Body() dto: CreateAuctionDto, @GetUser('id') userId: string) {
    return this.auctionsService.createAuction(dto, userId);
  }

  @Get(':id')
  getAuction(@Param('id') id: string) {
    return this.auctionsService.getAuctionById(id);
  }

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: true, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: true, example: 10 })
  listAuctions(
    @Query() filters: AuctionFiltersDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
  ): Promise<Pagination<Auction>> {
    return this.auctionsService.listAuctions(filters, {
      page: page,
      limit: limit,
    });
  }
}
