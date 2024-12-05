import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class PlaceBidDto {
  @ApiProperty({
    example: 100,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'jpbnop2tgyxp3vt5d4fyz2r4',
  })
  @IsString()
  auctionId: string;
}
