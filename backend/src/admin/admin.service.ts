import { Injectable, NotFoundException } from '@nestjs/common';
import {
  OrderStatus,
  OrderType,
  PaymentStatus,
  Prisma,
  ReviewStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsDto, SeriesPointDto } from './dto/analytics.dto';
import {
  UpdateOrderStatusDto,
  UpdatePaymentStatusDto,
} from './dto/update-order-status.dto';

const ORDER_SELECT = {
  id: true,
  reference: true,
  customerName: true,
  customerPhone: true,
  customerAddress: true,
  customerNote: true,
  items: true,
  subtotal: true,
  deliveryFee: true,
  total: true,
  orderType: true,
  status: true,
  paymentMethod: true,
  paymentStatus: true,
  createdAt: true,
  user: { select: { id: true, name: true, email: true, phone: true } },
} as const;

type OrderLine = {
  itemId: string;
  slug: string;
  name: string;
  unitPrice: number;
  quantity: number;
  extras: { id: string; label: string; price: number }[];
  lineTotal: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const asLines = (value: Prisma.JsonValue): OrderLine[] =>
  Array.isArray(value) ? (value as unknown as OrderLine[]) : [];

const hourLabel = (hour: number): string => {
  const period = hour < 12 ? 'AM' : 'PM';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display} ${period}`;
};

/** Orders that are still moving through the kitchen. */
const OPEN_STATUSES: OrderStatus[] = [
  OrderStatus.PLACED,
  OrderStatus.CONFIRMED,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.OUT_FOR_DELIVERY,
];

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  getUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    });
  }

  getOrders(status?: OrderStatus) {
    return this.prisma.order.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      select: ORDER_SELECT,
    });
  }

  async getOrder(id: string) {
    const order = await this.prisma.order.findFirst({
      where: { OR: [{ id }, { reference: id }] },
      select: ORDER_SELECT,
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  getPayments() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        reference: true,
        customerName: true,
        total: true,
        paymentMethod: true,
        paymentStatus: true,
        createdAt: true,
      },
    });
  }

  async getSummary() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      userCount,
      orderCount,
      openOrders,
      pendingPayments,
      newMessages,
      pendingReviews,
      paidAggregate,
      todayOrders,
      todayRevenue,
    ] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: { in: OPEN_STATUSES } } }),
      this.prisma.order.count({
        where: { paymentStatus: PaymentStatus.PENDING },
      }),
      this.prisma.contactMessage.count({ where: { status: 'NEW' } }),
      this.prisma.review.count({ where: { status: ReviewStatus.PENDING } }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: PaymentStatus.PAID },
      }),
      this.prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: { gte: todayStart },
          status: { not: OrderStatus.CANCELLED },
        },
      }),
    ]);

    return {
      userCount,
      orderCount,
      openOrders,
      pendingPayments,
      newMessages,
      pendingReviews,
      paidAmount: paidAggregate._sum.total ?? 0,
      ordersToday: todayOrders,
      revenueToday: todayRevenue._sum.total ?? 0,
    };
  }

  async updateOrderStatus(id: string, dto: UpdateOrderStatusDto) {
    await this.ensureOrderExists(id);
    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      select: ORDER_SELECT,
    });
  }

  async updatePaymentStatus(id: string, dto: UpdatePaymentStatusDto) {
    await this.ensureOrderExists(id);
    return this.prisma.order.update({
      where: { id },
      data: { paymentStatus: dto.paymentStatus },
      select: ORDER_SELECT,
    });
  }

  /**
   * Every figure here is derived from real orders. Cancelled orders are left
   * out of revenue and sales so the charts reflect what the kitchen actually
   * sold, but they still count toward the raw order totals in the summary.
   */
  async getAnalytics(): Promise<AnalyticsDto> {
    const since = new Date(Date.now() - 6 * DAY_MS);
    since.setHours(0, 0, 0, 0);

    const [recentOrders, allOrders, categories, reviewStats] =
      await Promise.all([
        this.prisma.order.findMany({
          where: {
            createdAt: { gte: since },
            status: { not: OrderStatus.CANCELLED },
          },
          select: { createdAt: true, total: true },
        }),
        this.prisma.order.findMany({
          where: { status: { not: OrderStatus.CANCELLED } },
          select: { items: true, createdAt: true, orderType: true },
        }),
        this.prisma.menuItem.findMany({
          select: { slug: true, category: { select: { name: true } } },
        }),
        this.prisma.review.aggregate({
          where: { status: ReviewStatus.APPROVED },
          _avg: { rating: true },
          _count: { _all: true },
        }),
      ]);

    const categoryBySlug = new Map(
      categories.map((item) => [item.slug, item.category.name]),
    );

    return {
      dailyOrders: this.bucketByDay(recentOrders, () => 1),
      dailyRevenue: this.bucketByDay(recentOrders, (order) => order.total),
      topItems: this.topItems(allOrders),
      peakHours: this.peakHours(allOrders),
      orderTypeSplit: this.orderTypeSplit(allOrders),
      byCategory: this.byCategory(allOrders, categoryBySlug),
      averageRating: Math.round((reviewStats._avg.rating ?? 0) * 10) / 10,
      reviewCount: reviewStats._count._all,
    };
  }

  /** Last 7 calendar days, including days with no orders. */
  private bucketByDay(
    orders: { createdAt: Date; total: number }[],
    valueOf: (order: { createdAt: Date; total: number }) => number,
  ): SeriesPointDto[] {
    const buckets = new Map<string, number>();
    const labels: { key: string; label: string }[] = [];

    for (let offset = 6; offset >= 0; offset -= 1) {
      const day = new Date(Date.now() - offset * DAY_MS);
      const key = day.toISOString().slice(0, 10);
      buckets.set(key, 0);
      labels.push({
        key,
        label: day.toLocaleDateString('en-US', { weekday: 'short' }),
      });
    }

    for (const order of orders) {
      const key = order.createdAt.toISOString().slice(0, 10);
      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) ?? 0) + valueOf(order));
      }
    }

    return labels.map(({ key, label }) => ({
      label,
      value: buckets.get(key) ?? 0,
    }));
  }

  private topItems(orders: { items: Prisma.JsonValue }[]): SeriesPointDto[] {
    const sold = new Map<string, number>();
    for (const order of orders) {
      for (const line of asLines(order.items)) {
        sold.set(line.name, (sold.get(line.name) ?? 0) + line.quantity);
      }
    }

    return [...sold.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, value]) => ({ label, value }));
  }

  private peakHours(orders: { createdAt: Date }[]): SeriesPointDto[] {
    const hours = new Array<number>(24).fill(0);
    for (const order of orders) hours[order.createdAt.getHours()] += 1;
    return hours.map((value, hour) => ({ label: hourLabel(hour), value }));
  }

  private orderTypeSplit(orders: { orderType: OrderType }[]): SeriesPointDto[] {
    const labels: Record<OrderType, string> = {
      DELIVERY: 'Delivery',
      DINE_IN: 'Dine-in',
      TAKEAWAY: 'Takeaway',
    };

    const counts = new Map<OrderType, number>();
    for (const order of orders) {
      counts.set(order.orderType, (counts.get(order.orderType) ?? 0) + 1);
    }

    return (Object.keys(labels) as OrderType[]).map((type) => ({
      label: labels[type],
      value: counts.get(type) ?? 0,
    }));
  }

  private byCategory(
    orders: { items: Prisma.JsonValue }[],
    categoryBySlug: Map<string, string>,
  ) {
    const tally = new Map<string, { orders: number; revenue: number }>();

    for (const order of orders) {
      for (const line of asLines(order.items)) {
        // Dishes deleted since the order was placed fall back to "Other".
        const category = categoryBySlug.get(line.slug) ?? 'Other';
        const entry = tally.get(category) ?? { orders: 0, revenue: 0 };
        entry.orders += line.quantity;
        entry.revenue += line.lineTotal;
        tally.set(category, entry);
      }
    }

    return [...tally.entries()]
      .map(([label, value]) => ({ label, ...value }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  private async ensureOrderExists(id: string): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
  }
}
