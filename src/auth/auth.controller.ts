import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/user/dto/user.dto';
import express from 'express';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { REFRESH_TOKEN_COOKIE_KEY } from 'src/app.config';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { Cookies } from '../decorators/cookies-decorator';
import { clearRefreshTokenCookie, setRefreshTokenCookie } from './auth.cookies';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Serialize(UserDto)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const resDto = await this.authService.login(dto);
    if (dto.rememberMe) {
      if (!resDto.refreshToken) {
        throw new BadRequestException('Refresh token missing');
      }
      setRefreshTokenCookie(response, resDto.refreshToken);
    } else {
      clearRefreshTokenCookie(response);
    }
    return resDto;
  }

  @Get('me')
  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  verify(@CurrentUser() user: User) {
    return user;
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @Cookies() cookies: Record<string, any>,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const refreshToken = cookies[REFRESH_TOKEN_COOKIE_KEY] as string;

    if (!refreshToken || !user) {
      throw new BadRequestException();
    }

    const resDto = await this.authService.refreshToken(refreshToken, user);
    if (!resDto.refreshToken) {
      throw new BadRequestException('Refresh token missing');
    }
    setRefreshTokenCookie(response, resDto.refreshToken);
    return resDto;
  }
}
