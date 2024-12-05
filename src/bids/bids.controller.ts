import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { PlaceBidDto } from './dto/bid.dto';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { GetUser } from '../users/decorators/get-user.decorator';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginationOptionsDto } from 'src/pagination/pagination.dto';

@Controller('bids')
export class BidsController {
  constructor(private bidService: BidsService) {}

  @Post('place')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  placeBid(@Body() dto: PlaceBidDto, @GetUser('id') userId: string) {
    return this.bidService.placeBid(dto, userId);
  }

  @Get(':auctionId')
  @ApiQuery({ name: 'page', type: Number, required: true, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: true, example: 10 })
  getBidsForAuction(@Param('auctionId') auctionId: string) {
    return this.bidService.getBidsForAuction(auctionId);
  }

  @Get('history/:userId')
  @ApiQuery({ name: 'page', type: Number, required: true, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: true, example: 10 })
  getBidsForUser(
    @Param('userId') userId: string,
    @Query() paginationOptions: PaginationOptionsDto,
  ) {
    return this.bidService.getBidsForUser(userId, paginationOptions);
  }
}
