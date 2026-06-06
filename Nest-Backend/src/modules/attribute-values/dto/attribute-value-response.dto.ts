import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AttributeValueResponseDto {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() attributeId: string;
  @Expose() @ApiProperty() value: string;
  @Expose() @ApiProperty() slug: string;
  @Expose() @ApiProperty() sortOrder: number;
  @Expose() @ApiProperty() createdAt: Date;
  @Expose() @ApiProperty() updatedAt: Date;
}
