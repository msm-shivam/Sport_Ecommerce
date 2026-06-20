import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TicketTagResponseDto {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() ticketId: string;
  @Expose() @ApiProperty() tag: string;
  @Expose() @ApiProperty() createdAt: Date;
  @Expose() @ApiProperty() updatedAt: Date;
}
