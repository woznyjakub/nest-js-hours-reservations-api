import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { UserObject } from 'src/decorators/user-object.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() authLoginDto: AuthLoginDto,
    @Res() res: Response,
  ): Promise<any> {
    return this.authService.login(authLoginDto, res);
  }

  @Get('/logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Res() res: Response, @UserObject() user: User): Promise<any> {
    return this.authService.logout(res, user);
  }
}
