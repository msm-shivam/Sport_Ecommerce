import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchClickDto {
  @ApiProperty()
  @IsUUID()
  searchLogId: string;

  @ApiProperty()
  @IsUUID()
  productId: string;
}
