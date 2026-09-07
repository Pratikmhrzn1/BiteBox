import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MenuItem, Prisma, ReviewStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMenuItemDto,
  MenuItemResponseDto,
  MenuOptionDto,
  UpdateMenuItemDto,
} from './dto/menu-item.dto';

type MenuItemWithCategory = MenuItem & { category: { name: string } };

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(includeUnavailable = false): Promise<MenuItemResponseDto[]> {
    const items = await this.prisma.menuItem.findMany({
      where: includeUnavailable ? undefined : { available: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { category: { select: { name: true } } },
    });

    const ratings = await this.ratingsByItem();
    return items.map((item) => this.toResponse(item, ratings));
  }

  async findOne(idOrSlug: string): Promise<MenuItemResponseDto> {
    const item = await this.prisma.menuItem.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: { category: { select: { name: true } } },
    });
    if (!item) throw new NotFoundException(`Menu item ${idOrSlug} not found`);

    return this.toResponse(item, await this.ratingsByItem(item.id));
  }

  async findCategories() {
    return this.prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        _count: { select: { items: true } },
      },
    });
  }

  async create(dto: CreateMenuItemDto): Promise<MenuItemResponseDto> {
    const categoryId = await this.resolveCategoryId(dto.category);
    const slug = await this.uniqueSlug(slugify(dto.name));

    const item = await this.prisma.menuItem.create({
      data: {
        slug,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        image: dto.image,
        categoryId,
        bestSeller: dto.bestSeller ?? false,
        spicy: dto.spicy ?? false,
        vegetarian: dto.vegetarian ?? false,
        available: dto.available ?? true,
        sizes: (dto.sizes ?? []) as unknown as Prisma.InputJsonValue,
        extras: (dto.extras ?? []) as unknown as Prisma.InputJsonValue,
        sortOrder: dto.sortOrder ?? 0,
      },
      include: { category: { select: { name: true } } },
    });

    return this.toResponse(item, {});
  }

  async update(
    id: string,
    dto: UpdateMenuItemDto,
  ): Promise<MenuItemResponseDto> {
    const existing = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Menu item ${id} not found`);

    const data: Prisma.MenuItemUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.image !== undefined) data.image = dto.image;
    if (dto.bestSeller !== undefined) data.bestSeller = dto.bestSeller;
    if (dto.spicy !== undefined) data.spicy = dto.spicy;
    if (dto.vegetarian !== undefined) data.vegetarian = dto.vegetarian;
    if (dto.available !== undefined) data.available = dto.available;
    if (dto.sortOrder !== undefined) data.sortOrder = dto.sortOrder;
    if (dto.sizes !== undefined) {
      data.sizes = dto.sizes as unknown as Prisma.InputJsonValue;
    }
    if (dto.extras !== undefined) {
      data.extras = dto.extras as unknown as Prisma.InputJsonValue;
    }
    if (dto.category !== undefined) {
      data.category = {
        connect: { id: await this.resolveCategoryId(dto.category) },
      };
    }

    const item = await this.prisma.menuItem.update({
      where: { id },
      data,
      include: { category: { select: { name: true } } },
    });

    return this.toResponse(item, await this.ratingsByItem(id));
  }

  async remove(id: string): Promise<{ id: string; deleted: true }> {
    const existing = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Menu item ${id} not found`);

    await this.prisma.menuItem.delete({ where: { id } });
    return { id, deleted: true };
  }

  /** Creates the category on first use so the admin UI can type a new one. */
  private async resolveCategoryId(name: string): Promise<string> {
    const trimmed = name.trim();
    if (!trimmed)
      throw new BadRequestException('Category name cannot be empty');

    const slug = slugify(trimmed);
    const category = await this.prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name: trimmed, slug },
      select: { id: true },
    });
    return category.id;
  }

  private async uniqueSlug(base: string): Promise<string> {
    const seed = base || 'menu-item';
    for (let suffix = 0; ; suffix += 1) {
      const candidate = suffix === 0 ? seed : `${seed}-${suffix}`;
      const clash = await this.prisma.menuItem.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      if (!clash) return candidate;
    }
  }

  /** Average approved rating per menu item, keyed by item id. */
  private async ratingsByItem(
    menuItemId?: string,
  ): Promise<Record<string, { average: number; count: number }>> {
    const grouped = await this.prisma.review.groupBy({
      by: ['menuItemId'],
      where: {
        status: ReviewStatus.APPROVED,
        menuItemId: menuItemId ? menuItemId : { not: null },
      },
      _avg: { rating: true },
      _count: { _all: true },
    });

    return Object.fromEntries(
      grouped
        .filter((row): row is typeof row & { menuItemId: string } =>
          Boolean(row.menuItemId),
        )
        .map((row) => [
          row.menuItemId,
          {
            average: Math.round((row._avg.rating ?? 0) * 10) / 10,
            count: row._count._all,
          },
        ]),
    );
  }

  private toResponse(
    item: MenuItemWithCategory,
    ratings: Record<string, { average: number; count: number }>,
  ): MenuItemResponseDto {
    const rating = ratings[item.id];
    return {
      id: item.id,
      slug: item.slug,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
      category: item.category.name,
      bestSeller: item.bestSeller,
      spicy: item.spicy,
      vegetarian: item.vegetarian,
      available: item.available,
      sizes: (item.sizes ?? []) as unknown as MenuOptionDto[],
      extras: (item.extras ?? []) as unknown as MenuOptionDto[],
      rating: rating?.average ?? 0,
      reviewCount: rating?.count ?? 0,
    };
  }
}
