import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsBoolean } from 'class-validator';

export class CreateAuctionDto {
  @ApiProperty({
    example: 'auc_example',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'auc desc',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 11,
  })
  @IsNumber()
  startingPrice: number;

  @ApiProperty({
    example: 123,
  })
  @IsNumber()
  currentPrice: number;

  @ApiProperty({
    example: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  })
  @IsDate()
  endDate: Date;
}

export class AuctionFiltersDto {
  @IsNumber()
  minPrice?: number;

  @IsNumber()
  maxPrice?: number;

  searchTerm?: string;

  @IsBoolean()
  active?: boolean;
}
