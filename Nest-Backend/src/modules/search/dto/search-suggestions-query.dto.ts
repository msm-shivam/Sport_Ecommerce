import { IsInt, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchSuggestionsQueryDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  q: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  limit?: number;
}
