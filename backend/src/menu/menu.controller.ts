import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import {
  CreateMenuItemDto,
  MenuItemResponseDto,
  UpdateMenuItemDto,
} from './dto/menu-item.dto';
import { MenuService } from './menu.service';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({
    summary: 'List the menu',
    description:
      'Public. Returns available dishes with their sizes, extras and average rating. Admins can pass `includeUnavailable=true` to see hidden items.',
  })
  @ApiQuery({ name: 'includeUnavailable', required: false, type: Boolean })
  @ApiOkResponse({ type: MenuItemResponseDto, isArray: true })
  @Public()
  @Get()
  findAll(@Query('includeUnavailable') includeUnavailable?: string) {
    return this.menuService.findAll(includeUnavailable === 'true');
  }

  @ApiOperation({
    summary: 'List categories',
    description: 'Public. Menu categories with the number of dishes in each.',
  })
  @Public()
  @Get('categories')
  findCategories() {
    return this.menuService.findCategories();
  }

  @ApiOperation({
    summary: 'Get one dish',
    description: 'Public. Looks the dish up by id or slug.',
  })
  @ApiOkResponse({ type: MenuItemResponseDto })
  @Public()
  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.menuService.findOne(idOrSlug);
  }

  @ApiOperation({
    summary: 'Add a dish',
    description:
      'ADMIN only. The category is created if it does not exist yet.',
  })
  @ApiCreatedResponse({ type: MenuItemResponseDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateMenuItemDto) {
    return this.menuService.create(dto);
  }

  @ApiOperation({
    summary: 'Edit a dish',
    description: 'ADMIN only. Only the supplied fields are changed.',
  })
  @ApiOkResponse({ type: MenuItemResponseDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    return this.menuService.update(id, dto);
  }

  @ApiOperation({
    summary: 'Delete a dish',
    description:
      'ADMIN only. Past orders keep their own snapshot of the dish, so history is unaffected.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
