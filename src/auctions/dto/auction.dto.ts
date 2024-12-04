import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDate,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateAuctionDto {
  @ApiProperty({
    example: 'Auction 1',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Description',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 100,
  })
  @IsNumber()
  startingPrice: number;

  @IsNumber()
  currentPrice: number;

  @ApiProperty({
    example: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  })
  @IsDate()
  endDate: Date;
}

export class AuctionFiltersDto {
  @IsOptional()
  @IsNumber()
  minPrice: number;

  @IsOptional()
  @IsNumber()
  maxPrice: number;

  @IsOptional()
  searchTerm: string;

  @IsOptional()
  @IsBoolean()
  active: boolean;
}

export class PaginationOptionsDto {
  @IsNumber()
  page: number = 1;

  @IsNumber()
  limit: number = 10;
}
