import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const [user] = await this.userService.getUserByEmail(dto.email);
    if (user) {
      throw new BadRequestException('Email is already registered!');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(dto.password, salt);

    const userDto = plainToClass(CreateUserDto, dto, {
      excludeExtraneousValues: true,
    });
    userDto.salt = salt;
    userDto.hash = hash;
    return this.userService.create(userDto);
  }

  async login(dto: LoginDto) {
    const [user] = await this.userService.getUserByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('Email or Password is not correct');
    }
    const hash = await bcrypt.hash(dto.password, user.salt);
    if (hash != user.hash) {
      throw new BadRequestException('Email or Password is not correct');
    }

    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  async getUser(jwtPayload: any) {
    const userId = jwtPayload['sub'];
    const user = await this.userService.getUserById(userId);
    return user;
  }
}
