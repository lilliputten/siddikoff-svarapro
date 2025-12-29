import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // curl -H "Content-Type: application/json" -d '{"initData":"auth_date=1766976773&user=%7B%22id%22%3A490398083%2C%22first_name%22%3A%22Ig%22%2C%22username%22%3A%22lilliputten%22%2C%22language_code%22%3A%22en%22%7D&hash=mock_signature_for_development"}' http://localhost:3000/api/v1/auth/login
    console.log('[server/src/modules/auth/auth.controller.ts:login]', {
      loginDto,
      authService: this.authService,
    });
    if (!loginDto.initData.includes('hash=')) {
      throw new BadRequestException('Invalid initData format');
    }
    debugger;
    return this.authService.login(loginDto);
  }
}
