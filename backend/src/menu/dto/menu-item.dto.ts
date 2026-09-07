import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class MenuOptionDto {
  @ApiProperty({ example: 'extra-cheese', description: 'Machine id.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  id: string;

  @ApiProperty({
    example: 'Extra Cheese',
    description: 'Label shown to the customer.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  label: string;

  @ApiProperty({
    example: 40,
    description: 'Price in NPR (0 for a free option).',
  })
  @IsInt()
  @Min(0)
  price: number;
}

export class CreateMenuItemDto {
  @ApiProperty({ example: 'Smashed Chicken Burger' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  @ApiProperty({ example: 'Crispy smashed chicken patty with tangy slaw.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(400)
  description: string;

  @ApiProperty({ example: 290, description: 'Base price in NPR.' })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-...' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    example: 'Burgers',
    description: 'Category name; created if new.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  category: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  bestSeller?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  spicy?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  vegetarian?: boolean;

  @ApiProperty({
    required: false,
    default: true,
    description: 'Unavailable items stay on the menu but cannot be ordered.',
  })
  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @ApiProperty({ type: MenuOptionDto, isArray: true, required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuOptionDto)
  sizes?: MenuOptionDto[];

  @ApiProperty({ type: MenuOptionDto, isArray: true, required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuOptionDto)
  extras?: MenuOptionDto[];

  @ApiProperty({ required: false, description: 'Lower sorts first.' })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {}

export class MenuItemResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() slug: string;
  @ApiProperty() name: string;
  @ApiProperty() description: string;
  @ApiProperty() price: number;
  @ApiProperty() image: string;
  @ApiProperty({ description: 'Category name.' }) category: string;
  @ApiProperty() bestSeller: boolean;
  @ApiProperty() spicy: boolean;
  @ApiProperty() vegetarian: boolean;
  @ApiProperty() available: boolean;
  @ApiProperty({ type: MenuOptionDto, isArray: true }) sizes: MenuOptionDto[];
  @ApiProperty({ type: MenuOptionDto, isArray: true }) extras: MenuOptionDto[];
  @ApiProperty({
    description: 'Average approved review rating, 0 when unrated.',
  })
  rating: number;
  @ApiProperty({ description: 'Number of approved reviews.' })
  reviewCount: number;
}
