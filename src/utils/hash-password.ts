import { createHmac } from 'crypto';
// const bcrypt = require('bcrypt');

export function hashPassword(password: string): string {
  // const saltOrRounds = 10;
  // return bcrypt.hash(password, saltOrRounds);
  const salt = process.env.PASSWORD_GENERATE_SALT;

  if (salt) {
    const hmac = createHmac('sha512', salt);
    hmac.update(password);

    return hmac.digest('hex');
  }

  throw new Error('PASSWORD_GENERATE_SALT environment variable is missing.');
}
