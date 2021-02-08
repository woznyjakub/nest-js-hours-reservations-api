import { Injectable } from '@nestjs/common';
import { hashPassword } from '../utils/hash-password';
import { CreateUserResponse } from '../interfaces/user';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  async register(newUser: CreateUserDto): Promise<CreateUserResponse> {
    const { email, password } = newUser;

    if (await this.isEmailExist(email)) {
      return {
        isSuccess: false,
        message: 'This email is already in use.',
      };
    }

    const user = new User();
    user.email = email;
    user.passwordHash = await hashPassword(password);

    await user.save();

    return {
      isSuccess: true,
      message: 'Successfully added new user to database.',
      data: {
        userId: user.id,
        email: user.email,
      },
    };
  }

  async isEmailExist(email: string): Promise<boolean> {
    const users = await User.find({ email });

    return !!users.length;
  }
}
