import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomBytes } from 'crypto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { existsSync, mkdirSync } from 'fs';
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

const uploadsDir = join(__dirname, '..', '..', 'uploads');

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({
    summary: 'Upload an image',
    description:
      'ADMIN only. Accepts an image file and returns its public URL.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          if (!existsSync(uploadsDir))
            mkdirSync(uploadsDir, { recursive: true });
          cb(null, uploadsDir);
        },
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase();
          const name = `${Date.now()}-${randomBytes(8).toString('hex')}${ext}`;
          cb(null, name);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowed = /\.(jpg|jpeg|png|webp|gif|avif|svg)$/i.test(
          file.originalname,
        );
        cb(allowed ? null : new Error('Only image files are allowed'), allowed);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return { url: `/api/uploads/${file.filename}` };
  }

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
