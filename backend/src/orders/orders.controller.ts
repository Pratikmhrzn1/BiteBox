import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthUser } from '../common/auth-user';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDto } from './dto/order-response.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: 'Place an order',
    description:
      'Public (optional auth). Send the dishes and quantities — the server prices the order from the menu, so no totals are accepted from the client. The order links to the signed-in customer when a bearer token is sent.',
  })
  @ApiCreatedResponse({
    type: OrderDto,
    description: 'Order placed; payment starts as PENDING.',
  })
  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  create(@Body() dto: CreateOrderDto, @CurrentUser() user?: AuthUser) {
    return this.ordersService.create(dto, user?.sub);
  }

  @ApiOperation({
    summary: 'My orders',
    description: 'Order history for the signed-in customer, newest first.',
  })
  @ApiOkResponse({ type: OrderDto, isArray: true })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('mine')
  findMine(@CurrentUser() user: AuthUser) {
    return this.ordersService.findMine(user.sub);
  }

  @ApiOperation({
    summary: 'Track an order',
    description:
      'Public. Looks an order up by its reference (e.g. BB-1042) or id and returns its status only — guests need this too, so no customer details are exposed.',
  })
  @Public()
  @Get(':reference/track')
  track(@Param('reference') reference: string) {
    return this.ordersService.track(reference);
  }
}
