import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AddressResponseDto {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() userId: string;
  @Expose() @ApiProperty() fullName: string;
  @Expose() @ApiProperty() phone: string;
  @Expose() @ApiProperty() addressLine1: string;
  @Expose() @ApiPropertyOptional() addressLine2: string | null;
  @Expose() @ApiProperty() city: string;
  @Expose() @ApiProperty() state: string;
  @Expose() @ApiProperty() country: string;
  @Expose() @ApiProperty() postalCode: string;
  @Expose() @ApiProperty() latitude: number;
  @Expose() @ApiProperty() longitude: number;
  @Expose() @ApiProperty() isDefault: boolean;
  @Expose() @ApiProperty() createdAt: Date;
  @Expose() @ApiProperty() updatedAt: Date;
}
