import { ApiProperty } from '@nestjs/swagger';
import { ReviewStatus } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: 'Sita Gurung',
    description:
      'Display name. Ignored when signed in — the account name is used instead.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  authorName?: string;

  @ApiProperty({
    example: 'smashed-chicken-burger',
    description:
      'Id or slug of the dish being reviewed. Omit for a general review.',
    required: false,
  })
  @IsOptional()
  @IsString()
  menuItem?: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Best smash in Lalitpur' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @ApiProperty({ example: 'Juicy, crispy and the house sauce is unreal.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  body: string;
}

export class UpdateReviewStatusDto {
  @ApiProperty({ enum: ReviewStatus, example: ReviewStatus.APPROVED })
  @IsEnum(ReviewStatus)
  status: ReviewStatus;
}

export class ReviewResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() authorName: string;
  @ApiProperty() rating: number;
  @ApiProperty() title: string;
  @ApiProperty() body: string;
  @ApiProperty({ enum: ReviewStatus }) status: ReviewStatus;
  @ApiProperty({
    nullable: true,
    description: 'Name of the dish, when tied to one.',
  })
  itemName: string | null;
  @ApiProperty() createdAt: string;
}

export class ReviewSummaryDto {
  @ApiProperty({ description: 'Mean rating across approved reviews.' })
  average: number;

  @ApiProperty({ description: 'Number of approved reviews.' })
  total: number;

  @ApiProperty({
    description: 'Counts for 1★ through 5★, in that order.',
    type: Number,
    isArray: true,
  })
  counts: number[];
}
