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
import { MoreThan, Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import {
  DEFAULT_TOKEN_EXPIRY_DURATION,
  JWT_CLAIM_USER_ID,
  REFRESH_TOKEN_EXPIRY_DURATION_CONFIG_KEY,
  REFRESH_TOKEN_JWT_SECRET_CONFIG_KEY,
  REFRESH_TOKEN_EXPIRY_DURATION_VALUE_CONFIG_KEY,
} from 'src/app.config';
import { LoginResponseDto } from './dto/login-response.dto';

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

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const [user] = await this.userService.getUserByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('Email or Password is not correct');
    }
    const hash = await bcrypt.hash(dto.password, user.salt);
    if (hash != user.hash) {
      throw new BadRequestException('Email or Password is not correct');
    }

    return await this.generateToken(user, dto.rememberMe);
  }

  async getUser(jwtPayload: any) {
    const userId = jwtPayload[JWT_CLAIM_USER_ID];
    const user = await this.userService.getUserById(userId);
    return user;
  }

  async refreshToken(
    token: string,
    jwtPayload: any,
  ): Promise<LoginResponseDto> {
    const now = new Date();
    const existingRefreshToken = await this.refreshTokenRepo.findOne({
      where: { tokenHash: token, isDeleted: false, expiryDate: MoreThan(now) },
    });
    if (!existingRefreshToken) {
      throw new BadRequestException('invalid refresh token');
    }

    existingRefreshToken.isDeleted = true;
    existingRefreshToken.modifiedDate = new Date();
    await this.refreshTokenRepo.save(existingRefreshToken);

    const user = await this.getUser(jwtPayload);
    if (!user) {
      throw new BadRequestException('invalid refresh token');
    }

    return await this.generateToken(user, true);
  }

  private async generateToken(
    user: User,
    rememberMe: boolean,
  ): Promise<LoginResponseDto> {
    const resDto: LoginResponseDto = {
      accessToken: '',
      refreshToken: undefined,
    };

    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);
    resDto.accessToken = accessToken;
    if (rememberMe) {
      const refreshToken = await this.generateRefreshToken(user);
      resDto.refreshToken = refreshToken;
    }
    return resDto;
  }

  private async generateRefreshToken(user: User) {
    const refreshTokenSecret = this.configService.get<string>(
      REFRESH_TOKEN_JWT_SECRET_CONFIG_KEY,
    );
    const refreshTokenExpiry = (this.configService.get<string>(
      REFRESH_TOKEN_EXPIRY_DURATION_CONFIG_KEY,
    ) ?? DEFAULT_TOKEN_EXPIRY_DURATION) as StringValue;
    const refreshTokenExpiryValue =
      Number(
        this.configService.get<string>(
          REFRESH_TOKEN_EXPIRY_DURATION_VALUE_CONFIG_KEY,
        ),
      ) || 1;

    const payload = { sub: user.id };
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
