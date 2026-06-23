import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FaqResponseDto {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() question: string;
  @Expose() @ApiProperty() answer: string;
  @Expose() @ApiPropertyOptional() category: string | null;
  @Expose() @ApiProperty() sortOrder: number;
  @Expose() @ApiProperty() isActive: boolean;
  @Expose() @ApiProperty() createdAt: Date;
  @Expose() @ApiProperty() updatedAt: Date;
}
