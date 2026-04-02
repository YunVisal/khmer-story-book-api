import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './refresh-token.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
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

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
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
    const refreshToken = await this.generateRefreshToken(user, payload);

    return { accessToken, refreshToken };
  }

  async getUser(jwtPayload: any) {
    const userId = jwtPayload['sub'];
    const user = await this.userService.getUserById(userId);
    return user;
  }

  private async generateRefreshToken(user: User, payload: any) {
    const refreshTokenSecret = this.configService.get<string>(
      'REFRESH_TOKEN_JWT_SECRET',
    );
    const refreshTokenExpiry = (this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRY_DURATION',
    ) ?? '60s') as StringValue;
    const refreshTokenExpiryValue =
      Number(
        this.configService.get<string>('REFRESH_TOKEN_EXPIRY_DURATION_VALUE'),
      ) || 1;

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshTokenSecret,
      expiresIn: refreshTokenExpiry,
    });
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + refreshTokenExpiryValue);
    const refreshTokenDto = {
      tokenHash: refreshToken,
      expiryDate,
      createdDate: new Date(),
    };
    const entity = this.refreshTokenRepo.create(refreshTokenDto);
    entity.user = user;
    await this.refreshTokenRepo.save(entity);
    return refreshToken;
  }
}
