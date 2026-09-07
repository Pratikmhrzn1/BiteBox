import { ApiProperty } from '@nestjs/swagger';
import { AuthUserDto } from './auth-user.dto';

export class AuthResultDto {
  @ApiProperty({ description: 'The authenticated user profile.' })
  user!: AuthUserDto;

  @ApiProperty({
    description:
      'JWT access token. Send it as `Authorization: Bearer <token>` for protected routes.',
  })
  accessToken!: string;
}
