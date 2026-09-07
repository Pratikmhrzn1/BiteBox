import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';
import { PrismaService } from './prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @ApiOperation({
    summary: 'Health check',
    description:
      'Public. Confirms the API is up and that it can reach the database — the frontend uses this to tell "backend down" from "backend up, query failed".',
  })
  @ApiOkResponse({
    description: 'Reports `ok` when the database round-trip succeeds.',
  })
  @Public()
  @Get()
  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        database: 'up',
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: 'degraded',
        database: 'down',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
