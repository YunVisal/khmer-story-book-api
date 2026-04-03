import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_CURRENT_USER_KEY } from 'src/app.config';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request[REQUEST_CURRENT_USER_KEY];
  },
);
