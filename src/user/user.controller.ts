import { Controller, Post, Body, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserResponse } from '../interfaces/user';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Post('/register')
  register(@Body() createUserDto: CreateUserDto): Promise<CreateUserResponse> {
    return this.userService.register(createUserDto);
  }
}
