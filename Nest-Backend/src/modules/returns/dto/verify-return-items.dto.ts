import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ReturnItemCondition } from '../enums/return-item-condition.enum';

class VerifyItemDto {
  @ApiProperty()
  @IsUUID()
  itemId: string;

  @ApiProperty({ enum: ReturnItemCondition })
  @IsEnum(ReturnItemCondition)
  condition: ReturnItemCondition;
}

export class VerifyReturnItemsDto {
  @ApiProperty({ type: [VerifyItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VerifyItemDto)
  items: VerifyItemDto[];
}
