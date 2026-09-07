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
import { MessageStatus, UserRole } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import {
  ContactMessageDto,
  CreateContactMessageDto,
  UpdateMessageStatusDto,
} from './dto/contact.dto';
import { ContactService } from './contact.service';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @ApiOperation({
    summary: 'Send a message',
    description:
      'Public. Stores a contact-form submission for the team to read in the admin panel.',
  })
  @ApiCreatedResponse({
    description: 'Message stored; returns only the id and receipt time.',
  })
  @Public()
  @Post()
  create(@Body() dto: CreateContactMessageDto) {
    return this.contactService.create(dto);
  }

  @ApiOperation({
    summary: 'List messages',
    description: 'ADMIN only. Optionally filter by status.',
  })
  @ApiQuery({ name: 'status', required: false, enum: MessageStatus })
  @ApiOkResponse({ type: ContactMessageDto, isArray: true })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll(@Query('status') status?: MessageStatus) {
    return this.contactService.findAll(status);
  }

  @ApiOperation({
    summary: 'Update message status',
    description: 'ADMIN only. Mark a message as READ or ARCHIVED.',
  })
  @ApiOkResponse({ type: ContactMessageDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateMessageStatusDto) {
    return this.contactService.updateStatus(id, dto);
  }

  @ApiOperation({ summary: 'Delete a message', description: 'ADMIN only.' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
