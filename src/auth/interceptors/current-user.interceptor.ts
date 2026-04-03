import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { REQUEST_CURRENT_USER_KEY, REQUEST_USER_ID_KEY } from 'src/app.config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request[REQUEST_USER_ID_KEY] as number;

    if (userId) {
      const user = await this.userService.getUserById(userId);
      request[REQUEST_CURRENT_USER_KEY] = user;
    }
    return next.handle();
  }
}
