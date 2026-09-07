import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { SiteContentDto, UpdateSiteContentDto } from './dto/content.dto';
import { ContentService } from './content.service';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiOperation({
    summary: 'Get site copy',
    description:
      'Public. Hero text, announcement banner, opening hours and restaurant details rendered across the site.',
  })
  @ApiOkResponse({ type: SiteContentDto })
  @Public()
  @Get()
  get() {
    return this.contentService.get();
  }

  @ApiOperation({
    summary: 'Replace site copy',
    description:
      'ADMIN only. Send the whole content object — this is a full replace, not a merge.',
  })
  @ApiOkResponse({ type: SiteContentDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put()
  update(@Body() dto: UpdateSiteContentDto) {
    return this.contentService.update(dto);
  }
}
