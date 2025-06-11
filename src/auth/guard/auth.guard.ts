import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = await this.authService.validateUser(request.email, request.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    request.user = user;

    return true;
  }
}
