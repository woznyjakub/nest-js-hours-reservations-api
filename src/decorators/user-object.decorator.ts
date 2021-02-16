import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserObject = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user;
  },
);
