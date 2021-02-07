import { Injectable } from '@nestjs/common';
import Ajv, { JSONSchemaType } from 'ajv';
import { hashPassword } from '../utils/hash-password';
import { CreateUserResponse, UserRole } from '../interfaces/user';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private validator = new Ajv();

  async register(newUser: CreateUserDto): Promise<CreateUserResponse> {
    const [isValid, errors] = this.isUserValid(newUser);
    const { email, password } = newUser;

    if (isValid) {
      if (await this.isEmailExist(email)) {
        return {
          isSuccess: false,
          errors: [
            {
              message: `This e-mail (${email}) already exist.`,
            },
          ],
        };
      }

      const user = new User();
      user.email = email;
      user.passwordHash = await hashPassword(password);
      user.role = UserRole.User;

      await user.save();
    }
    return {
      isSuccess: isValid,
      errors,
    };
  }

  async isEmailExist(email: string): Promise<boolean> {
    const user = await User.find({
      where: {
        email,
      },
    });

    return !!user.length;
  }

  isUserValid(user: CreateUserDto): [boolean, any?] {
    const emailPattern = '^\\w+([.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$';

    const passwordPattern =
      '((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$';

    console.log('user:', user);
    const schema: JSONSchemaType<CreateUserDto> = {
      type: 'object',
      properties: {
        email: { type: 'string', minLength: 3, pattern: emailPattern },
        password: { type: 'string', minLength: 6, pattern: passwordPattern },
      },
      required: ['email', 'password'],
      additionalProperties: false,
    };

    const validate = this.validator.compile(schema);

    const isValid = validate(user);

    return [isValid, validate.errors];
  }
}
