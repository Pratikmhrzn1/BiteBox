import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsHexColor,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class HeroDto {
  @ApiProperty({ example: 'EAT' })
  @IsString()
  @MaxLength(24)
  line1: string;

  @ApiProperty({ example: 'ENJOY' })
  @IsString()
  @MaxLength(24)
  line2: string;

  @ApiProperty({ example: 'REPEAT' })
  @IsString()
  @MaxLength(24)
  line3: string;

  @ApiProperty({ example: 'Smashed fresh. Served loud.' })
  @IsString()
  @MaxLength(240)
  subtext: string;

  @ApiProperty({ example: 'Order Now' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  cta: string;
}

class AnnouncementDto {
  @ApiProperty({ description: 'Hides the banner site-wide when false.' })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ example: 'Happy Hours: 10% off all drinks till 6 PM' })
  @IsString()
  @MaxLength(160)
  text: string;

  @ApiProperty({ example: '#E8452C', description: 'Banner background colour.' })
  @IsHexColor()
  color: string;
}

class OpeningHourRowDto {
  @ApiProperty({ example: 'Mon–Thu' })
  @IsString()
  @MaxLength(40)
  label: string;

  @ApiProperty({ example: '11:30 AM' })
  @IsString()
  @MaxLength(20)
  from: string;

  @ApiProperty({ example: '10:00 PM' })
  @IsString()
  @MaxLength(20)
  to: string;

  @ApiProperty({ description: 'Shows "Closed" instead of the time range.' })
  @IsBoolean()
  closed: boolean;
}

class OpeningHoursDto {
  @ApiProperty({ example: 'Opening Hours' })
  @IsString()
  @MaxLength(60)
  title: string;

  @ApiProperty({ type: OpeningHourRowDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpeningHourRowDto)
  rows: OpeningHourRowDto[];
}

class RestaurantDto {
  @ApiProperty({ example: 'Nakhipot, Lalitpur, Nepal' })
  @IsString()
  @MaxLength(160)
  address: string;

  @ApiProperty({ description: 'Google Maps embed URL used by the map iframe.' })
  @IsString()
  @MaxLength(600)
  mapEmbedUrl: string;

  @ApiProperty({ example: '+977 9800000000' })
  @IsString()
  @MaxLength(30)
  phone: string;

  @ApiProperty({ example: 'hello@bitebox.com.np' })
  @IsString()
  @MaxLength(120)
  email: string;

  @ApiProperty({ example: "We're Open" })
  @IsString()
  @MaxLength(40)
  hoursLabel: string;

  @ApiProperty({ example: 'Mon–Sun: 11:30 AM – 10:00 PM' })
  @IsString()
  @MaxLength(120)
  hours: string;
}

export class UpdateSiteContentDto {
  @ApiProperty({ type: HeroDto })
  @ValidateNested()
  @Type(() => HeroDto)
  hero: HeroDto;

  @ApiProperty({ type: AnnouncementDto })
  @ValidateNested()
  @Type(() => AnnouncementDto)
  announcement: AnnouncementDto;

  @ApiProperty({ type: OpeningHoursDto })
  @ValidateNested()
  @Type(() => OpeningHoursDto)
  openingHours: OpeningHoursDto;

  @ApiProperty({ type: RestaurantDto })
  @ValidateNested()
  @Type(() => RestaurantDto)
  restaurant: RestaurantDto;
}

export class SiteContentDto extends UpdateSiteContentDto {
  @ApiProperty({ description: 'When the copy was last edited.' })
  updatedAt: string;
}
