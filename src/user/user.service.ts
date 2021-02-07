import { Injectable } from '@nestjs/common';
import Ajv, { JSONSchemaType } from 'ajv';
import { CreateUserResponse } from '../interfaces/user';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private validator = new Ajv();

  async register(newUser: CreateUserDto): Promise<CreateUserResponse> {
    const [isValid, errors] = this.isUserValid(newUser);

    if (isValid) {
      const user = new User();
      user.login = newUser.email;
      user.passwordHash = newUser.password;
      await user.save();
    }
    return {
      isSuccess: isValid,
      errors,
    };
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
        password: { type: 'string', minLength: 6 },
      },
      required: ['email', 'password'],
      additionalProperties: false,
    };

    const validate = this.validator.compile(schema);

    const isValid = validate(user);

    return [isValid, validate.errors];
  }
}
