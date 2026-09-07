import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MenuItem, Order, OrderType, Prisma } from '@prisma/client';
import { buildOrderReference, deliveryFeeFor } from '../common/pricing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, OrderLineDto } from './dto/create-order.dto';
import { OrderDto, OrderLineSnapshotDto } from './dto/order-response.dto';

type MenuOption = { id: string; label: string; price: number };

const asOptions = (value: Prisma.JsonValue | null): MenuOption[] =>
  Array.isArray(value) ? (value as unknown as MenuOption[]) : [];

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Prices the order from the menu table rather than from the request body, so
   * a tampered client cannot dictate what it pays. The resulting per-line
   * snapshot is what the kitchen and the receipts read from — later menu edits
   * never rewrite a placed order.
   */
  async create(dto: CreateOrderDto, userId?: string): Promise<OrderDto> {
    const orderType = dto.orderType ?? OrderType.DELIVERY;

    if (orderType === OrderType.DELIVERY && !dto.customerAddress?.trim()) {
      throw new BadRequestException(
        'customerAddress is required for delivery orders',
      );
    }

    const menuItems = await this.loadMenuItems(dto.items);
    const lines = dto.items.map((line) =>
      this.priceLine(line, menuItems.get(line.menuItem)!),
    );

    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    const deliveryFee = deliveryFeeFor(orderType);

    const order = await this.createWithReference({
      userId: userId ?? null,
      customerName: dto.customerName.trim(),
      customerPhone: dto.customerPhone.trim(),
      customerAddress: dto.customerAddress?.trim() || null,
      customerNote: dto.customerNote?.trim() || null,
      items: lines as unknown as Prisma.InputJsonValue,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      orderType,
      paymentMethod: dto.paymentMethod,
    });

    return this.toDto(order);
  }

  /** Order history for the signed-in customer. */
  async findMine(userId: string): Promise<OrderDto[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((order) => this.toDto(order));
  }

  /**
   * Order tracking. The reference alone is enough to look an order up — it is
   * unguessable enough for a status page, and guests need it too — but the
   * response is deliberately narrow: status only, never the customer's details.
   */
  async track(reference: string) {
    const order = await this.prisma.order.findFirst({
      where: { OR: [{ reference }, { id: reference }] },
      select: {
        reference: true,
        status: true,
        orderType: true,
        paymentStatus: true,
        total: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!order) throw new NotFoundException(`Order ${reference} not found`);

    return {
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  private async loadMenuItems(
    lines: OrderLineDto[],
  ): Promise<Map<string, MenuItem>> {
    const keys = [...new Set(lines.map((line) => line.menuItem))];
    const items = await this.prisma.menuItem.findMany({
      where: { OR: [{ id: { in: keys } }, { slug: { in: keys } }] },
    });

    const byKey = new Map<string, MenuItem>();
    for (const item of items) {
      byKey.set(item.id, item);
      byKey.set(item.slug, item);
    }

    for (const key of keys) {
      const item = byKey.get(key);
      if (!item) throw new NotFoundException(`Menu item ${key} not found`);
      if (!item.available) {
        throw new BadRequestException(`${item.name} is currently unavailable`);
      }
    }

    return byKey;
  }

  private priceLine(line: OrderLineDto, item: MenuItem): OrderLineSnapshotDto {
    const sizes = asOptions(item.sizes);
    const availableExtras = asOptions(item.extras);

    let unitPrice = item.price;
    if (line.size) {
      const size = sizes.find((option) => option.id === line.size);
      if (!size) {
        throw new BadRequestException(
          `"${line.size}" is not a size offered for ${item.name}`,
        );
      }
      unitPrice = size.price;
    }

    const extras = (line.extras ?? []).map((extraId) => {
      const extra = availableExtras.find((option) => option.id === extraId);
      if (!extra) {
        throw new BadRequestException(
          `"${extraId}" is not an extra offered for ${item.name}`,
        );
      }
      return { id: extra.id, label: extra.label, price: extra.price };
    });

    const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0);

    return {
      itemId: item.id,
      slug: item.slug,
      name: item.name,
      unitPrice,
      quantity: line.quantity,
      extras,
      lineTotal: (unitPrice + extrasTotal) * line.quantity,
    };
  }

  /**
   * References are sequential for readability, which means two orders placed at
   * the same instant can pick the same number. Rather than lock the table, we
   * let the unique constraint arbitrate and retry with the next number.
   */
  private async createWithReference(
    data: Omit<Prisma.OrderUncheckedCreateInput, 'reference'>,
  ): Promise<Order> {
    const existing = await this.prisma.order.count();

    for (let attempt = 0; attempt < 10; attempt += 1) {
      try {
        return await this.prisma.order.create({
          data: { ...data, reference: buildOrderReference(existing + attempt) },
        });
      } catch (error) {
        const isDuplicateReference =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002';
        if (!isDuplicateReference) throw error;
      }
    }

    throw new BadRequestException(
      'Could not allocate an order reference, please try again',
    );
  }

  private toDto(order: Order): OrderDto {
    return {
      id: order.id,
      reference: order.reference,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      customerNote: order.customerNote,
      items: order.items as unknown as OrderLineSnapshotDto[],
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      orderType: order.orderType,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt.toISOString(),
    };
  }
}
