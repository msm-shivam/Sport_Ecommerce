import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ShipmentStatus } from '../entities/shipment-status.enum';
import { OrderStatus } from '../../orders/entities/order.entity';

@Exclude()
class OrderInfo {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() orderNumber: string;
  @Expose() @ApiProperty({ enum: OrderStatus }) status: OrderStatus;
  @Expose() @ApiPropertyOptional() totalAmount: number | null;
  @Expose() @ApiPropertyOptional() customerName: string | null;
}

@Exclude()
class WarehouseInfo {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() name: string;
  @Expose() @ApiProperty() code: string;
  @Expose() @ApiProperty() city: string;
  @Expose() @ApiProperty() state: string;
  @Expose() @ApiProperty() country: string;
}

@Exclude()
export class ShipmentTrackingLogResponseDto {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() shipmentId: string;
  @Expose() @ApiProperty({ enum: ShipmentStatus }) status: ShipmentStatus;
  @Expose() @ApiPropertyOptional() note: string | null;
  @Expose() @ApiPropertyOptional() changedBy: string | null;
  @Expose() @ApiProperty() createdAt: Date;
}

@Exclude()
export class ShipmentResponseDto {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() orderId: string;
  @Expose() @ApiProperty() warehouseId: string;
  @Expose() @ApiProperty() trackingNumber: string;
  @Expose() @ApiProperty({ enum: ShipmentStatus }) status: ShipmentStatus;
  @Expose() @ApiPropertyOptional() notes: string | null;
  @Expose() @ApiPropertyOptional() dispatchedAt: Date | null;
  @Expose() @ApiPropertyOptional() deliveredAt: Date | null;
  @Expose() @ApiProperty() createdAt: Date;
  @Expose() @ApiProperty() updatedAt: Date;
  @Expose()
  @Type(() => OrderInfo)
  @ApiPropertyOptional({ type: OrderInfo })
  order?: OrderInfo;
  @Expose()
  @Type(() => WarehouseInfo)
  @ApiPropertyOptional({ type: WarehouseInfo })
  warehouse?: WarehouseInfo;
  @Expose()
  @Type(() => ShipmentTrackingLogResponseDto)
  @ApiPropertyOptional({ type: [ShipmentTrackingLogResponseDto] })
  trackingLogs?: ShipmentTrackingLogResponseDto[];
}
