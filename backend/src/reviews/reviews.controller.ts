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
import type { AuthUser } from '../common/auth-user';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import {
  CreateReviewDto,
  ReviewResponseDto,
  ReviewSummaryDto,
  UpdateReviewStatusDto,
} from './dto/review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({
    summary: 'List approved reviews',
    description:
      'Public. Pass `menuItem` (id or slug) to filter to one dish. Pending and hidden reviews are never returned here.',
  })
  @ApiQuery({ name: 'menuItem', required: false })
  @ApiOkResponse({ type: ReviewResponseDto, isArray: true })
  @Public()
  @Get()
  findApproved(@Query('menuItem') menuItem?: string) {
    return this.reviewsService.findApproved(menuItem);
  }

  @ApiOperation({
    summary: 'Rating summary',
    description: 'Public. Average rating and the 1★–5★ histogram.',
  })
  @ApiOkResponse({ type: ReviewSummaryDto })
  @Public()
  @Get('summary')
  summary() {
    return this.reviewsService.summary();
  }

  @ApiOperation({
    summary: 'Leave a review',
    description:
      'Public (optional auth). The review is saved as PENDING and appears on the site once an admin approves it.',
  })
  @ApiCreatedResponse({ type: ReviewResponseDto })
  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  create(@Body() dto: CreateReviewDto, @CurrentUser() user?: AuthUser) {
    return this.reviewsService.create(dto, user?.sub);
  }

  @ApiOperation({
    summary: 'List every review',
    description:
      'ADMIN only. Includes pending and hidden reviews for moderation.',
  })
  @ApiOkResponse({ type: ReviewResponseDto, isArray: true })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('all')
  findAll() {
    return this.reviewsService.findAll();
  }

  @ApiOperation({
    summary: 'Moderate a review',
    description: 'ADMIN only. Approve, hide, or send a review back to pending.',
  })
  @ApiOkResponse({ type: ReviewResponseDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateReviewStatusDto) {
    return this.reviewsService.updateStatus(id, dto);
  }

  @ApiOperation({ summary: 'Delete a review', description: 'ADMIN only.' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
