import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtAuthGuard, UserRequest } from './jwt-auth.guard';

@Injectable()
export class OptionalJwtAuthGuard extends JwtAuthGuard {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<UserRequest>();
    const token = this.extractToken(request.headers.authorization);
    if (!token) return true;

    try {
      await this.attachUser(request, token);
    } catch {
      // Invalid tokens are ignored on optional-auth routes.
    }
    return true;
  }
}
