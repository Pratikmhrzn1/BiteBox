import { ApiProperty } from '@nestjs/swagger';

export class SeriesPointDto {
  @ApiProperty({ description: 'Axis label, e.g. "Mon" or "7 PM".' })
  label: string;

  @ApiProperty({ description: 'Value at that label.' })
  value: number;
}

export class CategoryBreakdownDto {
  @ApiProperty() label: string;
  @ApiProperty({ description: 'Number of items sold.' }) orders: number;
  @ApiProperty({ description: 'Revenue in NPR.' }) revenue: number;
}

export class AnalyticsDto {
  @ApiProperty({
    type: SeriesPointDto,
    isArray: true,
    description: 'Orders per day over the last 7 days.',
  })
  dailyOrders: SeriesPointDto[];

  @ApiProperty({
    type: SeriesPointDto,
    isArray: true,
    description: 'Revenue per day over the last 7 days (NPR).',
  })
  dailyRevenue: SeriesPointDto[];

  @ApiProperty({
    type: SeriesPointDto,
    isArray: true,
    description: 'Best-selling dishes by units sold.',
  })
  topItems: SeriesPointDto[];

  @ApiProperty({
    type: SeriesPointDto,
    isArray: true,
    description: 'Orders per hour of day, 12 AM through 11 PM.',
  })
  peakHours: SeriesPointDto[];

  @ApiProperty({
    type: SeriesPointDto,
    isArray: true,
    description: 'Share of orders by DELIVERY / DINE_IN / TAKEAWAY.',
  })
  orderTypeSplit: SeriesPointDto[];

  @ApiProperty({
    type: CategoryBreakdownDto,
    isArray: true,
    description: 'Units sold and revenue per menu category.',
  })
  byCategory: CategoryBreakdownDto[];

  @ApiProperty({ description: 'Mean approved review rating.' })
  averageRating: number;

  @ApiProperty({ description: 'Number of approved reviews.' })
  reviewCount: number;
}
