import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import type { AuthUser } from '../common/auth-user';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthResultDto } from './dto/auth-result.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Create a customer account',
    description:
      'Public. Registers a new CUSTOMER and returns a JWT access token.',
  })
  @ApiCreatedResponse({
    type: AuthResultDto,
    description: 'Account created; returns the profile and access token.',
  })
  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({
    summary: 'Sign in',
    description:
      'Public. Verifies credentials and returns a JWT access token. Use the token via the Authorize button.',
  })
  @ApiOkResponse({
    type: AuthResultDto,
    description: 'Successful login returns the profile and access token.',
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Current user',
    description: 'Returns the profile of the authenticated user.',
  })
  @ApiOkResponse({
    type: AuthUserDto,
    description: 'The authenticated user profile.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.authService.me(user.sub);
  }
}
