import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class WarehouseResponseDto {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() name: string;
  @Expose() @ApiProperty() code: string;
  @Expose() @ApiPropertyOptional() phone: string | null;
  @Expose() @ApiPropertyOptional() email: string | null;
  @Expose() @ApiProperty() address: string;
  @Expose() @ApiProperty() city: string;
  @Expose() @ApiProperty() state: string;
  @Expose() @ApiProperty() country: string;
  @Expose() @ApiProperty() postalCode: string;
  @Expose() @ApiProperty() latitude: number;
  @Expose() @ApiProperty() longitude: number;
  @Expose() @ApiProperty() isActive: boolean;
  @Expose() @ApiProperty() createdAt: Date;
  @Expose() @ApiProperty() updatedAt: Date;
}
