import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ description: 'Unique user id.' })
  id!: string;

  @ApiProperty({ description: 'Full name of the user.' })
  name!: string;

  @ApiProperty({ description: 'Unique email used for login.' })
  email!: string;

  @ApiProperty({ description: 'Optional phone number.', nullable: true })
  phone!: string | null;

  @ApiProperty({ enum: UserRole, description: 'Role of the user.' })
  role!: UserRole;
}
