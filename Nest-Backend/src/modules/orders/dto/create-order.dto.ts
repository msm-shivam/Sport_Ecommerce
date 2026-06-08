import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  shippingAddressId: string;

  @ApiPropertyOptional({ example: 'Please deliver to the front desk.' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
