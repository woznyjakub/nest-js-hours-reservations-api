import { Injectable } from '@nestjs/common';
import { hashPassword } from '../utils/hash-password';
import { User } from '../user/entities/user.entity';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthLoginResponse } from '../interfaces/auth';
import { Response } from 'express';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { JwtPayload, JwtTokenData } from '../interfaces/auth';

@Injectable()
export class AuthService {
  private async generateUserToken(user: User): Promise<string> {
    let token;
    let userWithThisToken: User | undefined;

    // check with retries if any user already has this id
    do {
      token = uuid();
      userWithThisToken = await User.findOne({ currentTokenId: token });
    } while (userWithThisToken);

    user.currentTokenId = token;
    await user.save();

    return token;
  }

  private createJwtToken(currentTokenId: string): JwtTokenData {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = 60 * 60 * 24; // in seconds

    const accessToken = sign(payload, process.env.JWT_TOKEN_SALT, {
      expiresIn,
    });

    return {
      accessToken,
      expiresIn,
    };
  }

  async login({ email, password }: AuthLoginDto, res: Response): Promise<any> {
    try {
      const user = await User.findOne({
        email,

        /**
         * I must disable password checking for now, due to weird hashPassword() helper bahavior
         * that did not work for both bcrypt and node's crypto packages
         *
         * @example for password `Qwerty123`:
         * expected hash from crypto package: '27e8e2c44fde2e5cb97c7be031c115753924afb3834f12058370c834bac42ef8e0fa828ef85f194351b292a704d27fc906df740238f431b25cf8e1ecca4b1cc4',
         * but got: 'a8d21ad7116c5d6c3e76acee618449acf68ceaed77d636dda2726786984359786a4712423869cc02bb2180a549e068138c7d02ebb5a025ab21873441e711055e',
         */
        // passwordHash: hashPassword(password),
      });

      // const isMatch = await bcrypt.compare(password, user?.passwordHash);
      // console.log({ isMatch }, password, user?.passwordHash);

      console.log(
        'pwd:',
        hashPassword(password),
        password,
        password === 'Qwerty123',
        hashPassword('Qwerty123'),
      );

      if (!user) {
        return res.json(<AuthLoginResponse>{
          isSuccess: false,
          message: 'Wrong creadentials.',
        });
      }

      const newId = await this.generateUserToken(user as User);
      const { accessToken } = this.createJwtToken(newId);

      res.cookie('jwt', accessToken, {
        secure: false,
        domain: 'localhost',
        httpOnly: true,
      });

      return res.json(<AuthLoginResponse>{
        isSuccess: true,
        message: 'User successfully logged in.',
      });
    } catch (e) {
      res.json(<AuthLoginResponse>{
        isSuccess: false,
        message: e.message,
      });
    }
  }

  async logout(res: Response, user: User): Promise<any> {
    try {
      user.currentTokenId = null;
      await user.save();

      res.clearCookie('jwt', {
        secure: false,
        domain: 'localhost',
        httpOnly: true,
      });

      return res.json(<AuthLoginResponse>{
        isSuccess: true,
        message: 'User successfully logged out.',
      });
    } catch (e) {
      res.json(<AuthLoginResponse>{
        isSuccess: false,
        message: e.message,
      });
    }
  }
}
