import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DEFAULT_SITE_CONTENT, SiteContentData } from '../common/site-content';
import { PrismaService } from '../prisma/prisma.service';
import { SiteContentDto, UpdateSiteContentDto } from './dto/content.dto';

const SINGLETON_ID = 'singleton';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  /** Seeds the singleton row with the defaults the first time it is read. */
  async get(): Promise<SiteContentDto> {
    const row = await this.prisma.siteContent.upsert({
      where: { id: SINGLETON_ID },
      update: {},
      create: {
        id: SINGLETON_ID,
        data: DEFAULT_SITE_CONTENT,
      },
    });

    return {
      ...(row.data as unknown as SiteContentData),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async update(dto: UpdateSiteContentDto): Promise<SiteContentDto> {
    const row = await this.prisma.siteContent.upsert({
      where: { id: SINGLETON_ID },
      update: { data: dto as unknown as Prisma.InputJsonValue },
      create: {
        id: SINGLETON_ID,
        data: dto as unknown as Prisma.InputJsonValue,
      },
    });

    return {
      ...(row.data as unknown as SiteContentData),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
