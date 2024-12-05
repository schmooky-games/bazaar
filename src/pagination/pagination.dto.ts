import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PaginationOptionsDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page: number;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit: number;
}
