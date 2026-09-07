import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Zoe Smashburger',
    description: 'Full name of the new customer.',
    maxLength: 80,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name!: string;

  @ApiProperty({
    example: 'zoe@bitebox.com.np',
    description: 'Unique email address used for login.',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '9800000000',
    description: 'Optional Nepali phone number (7-15 characters).',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(7)
  @MaxLength(15)
  phone?: string;

  @ApiProperty({
    example: 'secret123',
    description: 'Password, min 6 characters. Stored hashed with bcrypt.',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(72)
  password!: string;
}
