import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePaymentDto {
  @ApiPropertyOptional({ example: 'Payment completed successfully' })
  @IsOptional()
  @IsString()
  notes?: string;
}
