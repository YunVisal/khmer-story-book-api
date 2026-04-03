import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Res,
  Req,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/user/dto/user.dto';
import express from 'express';
import { RefreshTokenGuard } from './refresh-token.gurard';
import { REFRESH_TOKEN_COOKIE_KEY } from 'src/app.config';

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
      response.cookie(REFRESH_TOKEN_COOKIE_KEY, resDto.refreshToken, {
        httpOnly: true,
      });
    } else {
      response.clearCookie(REFRESH_TOKEN_COOKIE_KEY);
    }
    return resDto;
  }

  @Get('me')
  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  async verify(@Request() req) {
    return this.authService.getUser(req.user);
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @Req() request,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const refreshToken = request.cookies[REFRESH_TOKEN_COOKIE_KEY] as string;
    const user = request.user;

    const resDto = await this.authService.refreshToken(refreshToken, user);
    response.cookie(REFRESH_TOKEN_COOKIE_KEY, resDto.refreshToken, {
      httpOnly: true,
    });
    return resDto;
  }
}
