import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Review, ReviewStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateReviewDto,
  ReviewResponseDto,
  ReviewSummaryDto,
  UpdateReviewStatusDto,
} from './dto/review.dto';

type ReviewWithItem = Review & { menuItem: { name: string } | null };

const REVIEW_INCLUDE = { menuItem: { select: { name: true } } } as const;

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public feed: approved reviews only, newest first. */
  async findApproved(menuItem?: string): Promise<ReviewResponseDto[]> {
    const menuItemId = menuItem
      ? await this.resolveMenuItemId(menuItem)
      : undefined;

    const reviews = await this.prisma.review.findMany({
      where: {
        status: ReviewStatus.APPROVED,
        ...(menuItemId ? { menuItemId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: REVIEW_INCLUDE,
    });

    return reviews.map((review) => this.toResponse(review));
  }

  async findAll(): Promise<ReviewResponseDto[]> {
    const reviews = await this.prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: REVIEW_INCLUDE,
    });
    return reviews.map((review) => this.toResponse(review));
  }

  async summary(): Promise<ReviewSummaryDto> {
    const grouped = await this.prisma.review.groupBy({
      by: ['rating'],
      where: { status: ReviewStatus.APPROVED },
      _count: { _all: true },
    });

    const counts = [0, 0, 0, 0, 0];
    let total = 0;
    let weighted = 0;
    for (const row of grouped) {
      const index = Math.min(Math.max(row.rating, 1), 5) - 1;
      counts[index] += row._count._all;
      total += row._count._all;
      weighted += row.rating * row._count._all;
    }

    return {
      average: total === 0 ? 0 : Math.round((weighted / total) * 10) / 10,
      total,
      counts,
    };
  }

  /**
   * New reviews land as PENDING so an admin approves them before they show on
   * the site. A signed-in reviewer's account name overrides whatever the form
   * submitted, so nobody can post under someone else's name.
   */
  async create(
    dto: CreateReviewDto,
    userId?: string,
  ): Promise<ReviewResponseDto> {
    const author = userId
      ? await this.prisma.user.findUnique({
          where: { id: userId },
          select: { name: true },
        })
      : null;

    const authorName = author?.name ?? dto.authorName?.trim();
    if (!authorName) {
      throw new BadRequestException(
        'authorName is required when posting without an account',
      );
    }

    const menuItemId = dto.menuItem
      ? await this.resolveMenuItemId(dto.menuItem)
      : null;

    const review = await this.prisma.review.create({
      data: {
        userId: userId ?? null,
        menuItemId,
        authorName,
        rating: dto.rating,
        title: dto.title,
        body: dto.body,
        status: ReviewStatus.PENDING,
      },
      include: REVIEW_INCLUDE,
    });

    return this.toResponse(review);
  }

  async updateStatus(
    id: string,
    dto: UpdateReviewStatusDto,
  ): Promise<ReviewResponseDto> {
    await this.ensureExists(id);
    const review = await this.prisma.review.update({
      where: { id },
      data: { status: dto.status },
      include: REVIEW_INCLUDE,
    });
    return this.toResponse(review);
  }

  async remove(id: string): Promise<{ id: string; deleted: true }> {
    await this.ensureExists(id);
    await this.prisma.review.delete({ where: { id } });
    return { id, deleted: true };
  }

  private async ensureExists(id: string): Promise<void> {
    const review = await this.prisma.review.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!review) throw new NotFoundException(`Review ${id} not found`);
  }

  private async resolveMenuItemId(idOrSlug: string): Promise<string> {
    const item = await this.prisma.menuItem.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      select: { id: true },
    });
    if (!item) throw new NotFoundException(`Menu item ${idOrSlug} not found`);
    return item.id;
  }

  private toResponse(review: ReviewWithItem): ReviewResponseDto {
    return {
      id: review.id,
      authorName: review.authorName,
      rating: review.rating,
      title: review.title,
      body: review.body,
      status: review.status,
      itemName: review.menuItem?.name ?? null,
      createdAt: review.createdAt.toISOString(),
    };
  }
}
