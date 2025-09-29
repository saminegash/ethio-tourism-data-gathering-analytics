import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { VerifyIdentityDto } from './dto/verify-identity.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Post('verify')
  verifyIdentity(@Body() payload: VerifyIdentityDto) {
    return this.authService.verifyIdentity(payload);
  }
}
