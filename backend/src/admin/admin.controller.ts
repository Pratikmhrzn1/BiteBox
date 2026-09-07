import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { OrderStatus, UserRole } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AnalyticsDto } from './dto/analytics.dto';
import {
  AdminOrderDto,
  AdminPaymentDto,
  AdminSummaryDto,
  AdminUserDto,
} from './dto/admin-response.dto';
import {
  UpdateOrderStatusDto,
  UpdatePaymentStatusDto,
} from './dto/update-order-status.dto';
import { AdminService } from './admin.service';

@ApiTags('admin')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({
    summary: 'Dashboard summary',
    description:
      'Headline counters: users, orders, open tickets, unpaid orders, unread messages, pending reviews and today’s takings. ADMIN only.',
  })
  @ApiOkResponse({ type: AdminSummaryDto })
  @Get('summary')
  getSummary() {
    return this.adminService.getSummary();
  }

  @ApiOperation({
    summary: 'Analytics',
    description:
      'Charts computed from real orders: daily orders and revenue, best sellers, peak hours, order-type split and category breakdown. ADMIN only.',
  })
  @ApiOkResponse({ type: AnalyticsDto })
  @Get('analytics')
  getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @ApiOperation({
    summary: 'List users',
    description: 'All registered users with order counts. ADMIN only.',
  })
  @ApiOkResponse({ type: AdminUserDto, isArray: true })
  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @ApiOperation({
    summary: 'List orders',
    description:
      'All orders with customer, payment and linked-user details. ADMIN only.',
  })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  @ApiOkResponse({ type: AdminOrderDto, isArray: true })
  @Get('orders')
  getOrders(@Query('status') status?: OrderStatus) {
    return this.adminService.getOrders(status);
  }

  @ApiOperation({
    summary: 'Get one order',
    description: 'A single order by id or reference. ADMIN only.',
  })
  @ApiOkResponse({ type: AdminOrderDto })
  @Get('orders/:id')
  getOrder(@Param('id') id: string) {
    return this.adminService.getOrder(id);
  }

  @ApiOperation({
    summary: 'List payments',
    description: 'Payment records derived from orders. ADMIN only.',
  })
  @ApiOkResponse({ type: AdminPaymentDto, isArray: true })
  @Get('payments')
  getPayments() {
    return this.adminService.getPayments();
  }

  @ApiOperation({
    summary: 'Update order status',
    description:
      'Advances or sets the fulfilment status of an order. ADMIN only.',
  })
  @ApiOkResponse({ type: AdminOrderDto })
  @Patch('orders/:id/status')
  updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.adminService.updateOrderStatus(id, dto);
  }

  @ApiOperation({
    summary: 'Update payment status',
    description: 'Marks an order payment as PAID, FAILED, etc. ADMIN only.',
  })
  @ApiOkResponse({ type: AdminOrderDto })
  @Patch('orders/:id/payment')
  updatePaymentStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentStatusDto,
  ) {
    return this.adminService.updatePaymentStatus(id, dto);
  }
}
