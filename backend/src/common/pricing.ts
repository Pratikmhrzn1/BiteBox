import { OrderType } from '@prisma/client';

/** Flat delivery fee in NPR, charged on DELIVERY orders only. */
export const DELIVERY_FEE = 50;

export const deliveryFeeFor = (orderType: OrderType): number =>
  orderType === OrderType.DELIVERY ? DELIVERY_FEE : 0;

/** Human-friendly order reference, e.g. `BB-1042`. */
export const buildOrderReference = (sequence: number): string =>
  `BB-${String(1000 + sequence).padStart(4, '0')}`;
