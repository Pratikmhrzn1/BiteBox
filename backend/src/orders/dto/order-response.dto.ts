import {
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class OrderLineSnapshotDto {
  @ApiProperty({ description: 'Menu item id at order time.' }) itemId: string;
  @ApiProperty() slug: string;
  @ApiProperty() name: string;
  @ApiProperty({ description: 'Unit price used, after any size choice (NPR).' })
  unitPrice: number;
  @ApiProperty() quantity: number;
  @ApiProperty({
    description: 'Chosen extras, priced at order time.',
    type: 'array',
    items: { type: 'object', additionalProperties: true },
  })
  extras: { id: string; label: string; price: number }[];
  @ApiProperty({ description: '(unitPrice + extras) × quantity (NPR).' })
  lineTotal: number;
}

export class OrderDto {
  @ApiProperty() id: string;
  @ApiProperty({ description: 'Short human-friendly code, e.g. BB-1042.' })
  reference: string;
  @ApiProperty() customerName: string;
  @ApiProperty() customerPhone: string;
  @ApiProperty({ nullable: true }) customerAddress: string | null;
  @ApiProperty({ nullable: true }) customerNote: string | null;
  @ApiProperty({ type: OrderLineSnapshotDto, isArray: true })
  items: OrderLineSnapshotDto[];
  @ApiProperty() subtotal: number;
  @ApiProperty() deliveryFee: number;
  @ApiProperty() total: number;
  @ApiProperty({ enum: OrderType }) orderType: OrderType;
  @ApiProperty({ enum: OrderStatus }) status: OrderStatus;
  @ApiProperty({ enum: PaymentMethod }) paymentMethod: PaymentMethod;
  @ApiProperty({ enum: PaymentStatus }) paymentStatus: PaymentStatus;
  @ApiProperty() createdAt: string;
}
