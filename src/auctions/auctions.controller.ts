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
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('auctions')
export class AuctionsController {
  constructor(private auctionsService: AuctionsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createAuction(@Body() dto: CreateAuctionDto, @GetUser() userData: any) {
    return this.auctionsService.createAuction(dto, userData.sub);
  }

  @Get(':id')
  getAuction(@Param('id') id: string) {
    return this.auctionsService.getAuctionById(id);
  }

  @Get()
  @ApiQuery({ name: 'page', type: Number, required: true, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: true, example: 10 })
  async listAuctions(
    @Query() filters: AuctionFiltersDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 5,
  ): Promise<{
    items: any[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    return this.auctionsService.listAuctions(filters, { page, limit });
  }
}
