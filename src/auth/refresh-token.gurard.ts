import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  REFRESH_TOKEN_COOKIE_KEY,
  REFRESH_TOKEN_JWT_SECRET_CONFIG_KEY,
  REQUEST_USER_KEY,
} from 'src/app.config';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const refreshTokenCookie = request.cookies;
    if (!refreshTokenCookie[REFRESH_TOKEN_COOKIE_KEY]) {
      throw new BadRequestException('Refresh token not found');
    }

    const token = refreshTokenCookie[REFRESH_TOKEN_COOKIE_KEY];
    const refreshTokenSecret = this.configService.get<string>(
      REFRESH_TOKEN_JWT_SECRET_CONFIG_KEY,
    );
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: refreshTokenSecret,
      });
      request[REQUEST_USER_KEY] = payload;
    } catch {
      throw new BadRequestException();
    }
    return true;
  }
}
