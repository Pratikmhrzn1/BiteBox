import {
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
  UserRole,
} from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AdminSummaryDto {
  @ApiProperty({ description: 'Total registered users.' })
  userCount: number;

  @ApiProperty({ description: 'Total orders ever placed.' })
  orderCount: number;

  @ApiProperty({ description: 'Orders not yet delivered or cancelled.' })
  openOrders: number;

  @ApiProperty({ description: 'Orders still awaiting payment.' })
  pendingPayments: number;

  @ApiProperty({ description: 'Unread contact-form messages.' })
  newMessages: number;

  @ApiProperty({ description: 'Reviews waiting for moderation.' })
  pendingReviews: number;

  @ApiProperty({ description: 'Sum of totals for orders marked PAID (NPR).' })
  paidAmount: number;

  @ApiProperty({ description: 'Orders placed since midnight.' })
  ordersToday: number;

  @ApiProperty({ description: 'Value of today’s non-cancelled orders (NPR).' })
  revenueToday: number;
}

export class AdminUserDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty({ nullable: true }) phone: string | null;
  @ApiProperty({ enum: UserRole }) role: UserRole;
  @ApiProperty() createdAt: string;
  @ApiProperty({ description: 'Number of orders linked to this user.' })
  _count: { orders: number };
}

export class AdminOrderUserDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty({ nullable: true }) phone: string | null;
}

export class AdminOrderDto {
  @ApiProperty() id: string;
  @ApiProperty({
    description: 'Short code shown to the customer, e.g. BB-1042.',
  })
  reference: string;
  @ApiProperty() customerName: string;
  @ApiProperty() customerPhone: string;
  @ApiProperty({ nullable: true }) customerAddress: string | null;
  @ApiProperty({ nullable: true }) customerNote: string | null;

  @ApiProperty({
    description:
      'Priced snapshot of the ordered lines: { itemId, slug, name, unitPrice, quantity, extras[], lineTotal }.',
    type: 'array',
    items: { type: 'object', additionalProperties: true },
  })
  items: Record<string, unknown>[];

  @ApiProperty() subtotal: number;
  @ApiProperty() deliveryFee: number;
  @ApiProperty() total: number;
  @ApiProperty({ enum: OrderType }) orderType: OrderType;
  @ApiProperty({ enum: OrderStatus }) status: OrderStatus;
  @ApiProperty({ enum: PaymentMethod }) paymentMethod: PaymentMethod;
  @ApiProperty({ enum: PaymentStatus }) paymentStatus: PaymentStatus;
  @ApiProperty() createdAt: string;

  @ApiProperty({
    description:
      'The account the order is linked to, when placed while signed in.',
    nullable: true,
  })
  user: AdminOrderUserDto | null;
}

export class AdminPaymentDto {
  @ApiProperty() id: string;
  @ApiProperty() reference: string;
  @ApiProperty() customerName: string;
  @ApiProperty({ description: 'Amount due or paid (NPR).' }) total: number;
  @ApiProperty({ enum: PaymentMethod }) paymentMethod: PaymentMethod;
  @ApiProperty({ enum: PaymentStatus }) paymentStatus: PaymentStatus;
  @ApiProperty() createdAt: string;
}
