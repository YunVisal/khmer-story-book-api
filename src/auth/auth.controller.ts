import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Res,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/user/dto/user.dto';
import express from 'express';

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
    response.cookie('refresh', resDto.refreshToken, { httpOnly: true });
    return resDto;
  }

  @Get('me')
  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  async verify(@Request() req) {
    return this.authService.getUser(req.user);
  }
}
