// src/auth/auth.controller.ts
import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Req() request: Request, @Body() body: LoginDto) {
    const ip = request.ip || request.headers['x-forwarded-for'];
    console.log('IP Address:', ip);
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }
}
