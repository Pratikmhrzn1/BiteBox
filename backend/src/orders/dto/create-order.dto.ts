import { OrderType, PaymentMethod } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderLineDto {
  @ApiProperty({
    example: 'smashed-chicken-burger',
    description: 'Id or slug of the dish. The price comes from the database.',
  })
  @IsString()
  @IsNotEmpty()
  menuItem: string;

  @ApiProperty({ example: 2, minimum: 1, maximum: 50 })
  @IsInt()
  @Min(1)
  @Max(50)
  quantity: number;

  @ApiProperty({
    example: ['extra-cheese'],
    description:
      'Ids of the chosen extras. Each must be one of the extras defined on that dish.',
    required: false,
    type: String,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  extras?: string[];

  @ApiProperty({
    example: 'double',
    description:
      'Id of the chosen size. When set, its price replaces the base price.',
    required: false,
  })
  @IsOptional()
  @IsString()
  size?: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Zoe Smashburger' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  customerName: string;

  @ApiProperty({ example: '9800000000' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  customerPhone: string;

  @ApiProperty({
    example: 'Nakhipot, Lalitpur',
    description: 'Required for DELIVERY orders.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  customerAddress?: string;

  @ApiProperty({ example: 'Extra sauce on the side', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  customerNote?: string;

  @ApiProperty({ type: OrderLineDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => OrderLineDto)
  items: OrderLineDto[];

  @ApiProperty({
    enum: OrderType,
    example: OrderType.DELIVERY,
    description: 'DELIVERY adds the delivery fee; DINE_IN and TAKEAWAY do not.',
    required: false,
    default: OrderType.DELIVERY,
  })
  @IsOptional()
  @IsEnum(OrderType)
  orderType?: OrderType;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.ESEWA })
  @IsEnum(PaymentMethod, {
    message:
      'paymentMethod must be one of CASH_ON_DELIVERY, CARD, ESEWA, KHALTI',
  })
  paymentMethod: PaymentMethod;
}
