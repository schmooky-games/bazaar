import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PlaceBidDto {
  @ApiProperty({
    example: 100,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'e4e4aa1e-6b60-449f-90d4-38d97c7e4b36',
  })
  @IsString()
  auctionId: string;

  @ApiProperty({
    example: 'a0999328-9db8-4d8d-a4ec-8e76da723666',
  })
  @IsString()
  bidderId: string;
}
