import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() authLoginDto: AuthLoginDto,
    @Res() res: Response,
  ): Promise<any> {
    console.log(authLoginDto);
    return this.authService.login(authLoginDto, res);
  }

  @Post('/logout')
  async logout(@Res() res: Response, user: User) {
    return this.authService.logout(res, user);
  }
}
