import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateContactMessageDto,
  UpdateMessageStatusDto,
} from './dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactMessageDto) {
    const message = await this.prisma.contactMessage.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone ?? null,
        subject: dto.subject,
        message: dto.message,
      },
      select: { id: true, createdAt: true },
    });

    // The sender only needs to know it landed — never echo the stored row back.
    return { id: message.id, receivedAt: message.createdAt.toISOString() };
  }

  findAll(status?: MessageStatus) {
    return this.prisma.contactMessage.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, dto: UpdateMessageStatusDto) {
    await this.ensureExists(id);
    return this.prisma.contactMessage.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.contactMessage.delete({ where: { id } });
    return { id, deleted: true as const };
  }

  private async ensureExists(id: string): Promise<void> {
    const message = await this.prisma.contactMessage.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!message) throw new NotFoundException(`Message ${id} not found`);
  }
}
