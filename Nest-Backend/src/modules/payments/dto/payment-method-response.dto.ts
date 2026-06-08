import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PaymentMethodResponseDto {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() name: string;
  @Expose() @ApiProperty() code: string;
  @Expose() @ApiPropertyOptional() description: string | null;
  @Expose() @ApiProperty() isActive: boolean;
  @Expose() @ApiProperty() sortOrder: number;
  @Expose() @ApiProperty() createdAt: Date;
  @Expose() @ApiProperty() updatedAt: Date;
}
