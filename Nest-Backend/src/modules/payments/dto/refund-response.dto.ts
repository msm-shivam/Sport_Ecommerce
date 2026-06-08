import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { PaymentResponseDto } from './payment-response.dto';

@Exclude()
export class RefundResponseDto {
  @Expose() @ApiProperty() message: string;
  @Expose()
  @Type(() => PaymentResponseDto)
  @ApiProperty({ type: PaymentResponseDto })
  data: PaymentResponseDto;
}
