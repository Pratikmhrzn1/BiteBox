import { OrderStatus, PaymentStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.PREPARING,
    description:
      'New fulfilment status. Flow: PLACED → CONFIRMED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED, or CANCELLED at any point.',
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class UpdatePaymentStatusDto {
  @ApiProperty({
    enum: PaymentStatus,
    example: PaymentStatus.PAID,
    description: 'New payment status for the order.',
  })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;
}
