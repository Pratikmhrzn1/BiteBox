import { ApiProperty } from '@nestjs/swagger';
import { MessageStatus } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateContactMessageDto {
  @ApiProperty({ example: 'Zoe Smashburger' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  @ApiProperty({ example: 'zoe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+977 9800000000', required: false })
  @IsOptional()
  @IsString()
  @MinLength(7)
  @MaxLength(20)
  phone?: string;

  @ApiProperty({
    example: 'Catering',
    description: 'What the message is about.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  subject: string;

  @ApiProperty({ example: 'Do you cater office lunches in Lalitpur?' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;
}

export class UpdateMessageStatusDto {
  @ApiProperty({ enum: MessageStatus, example: MessageStatus.READ })
  @IsEnum(MessageStatus)
  status: MessageStatus;
}

export class ContactMessageDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty({ nullable: true }) phone: string | null;
  @ApiProperty() subject: string;
  @ApiProperty() message: string;
  @ApiProperty({ enum: MessageStatus }) status: MessageStatus;
  @ApiProperty() createdAt: string;
}
