import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { StringValue } from 'ms';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './refresh-token.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresIn = (configService.get<string>(
          'ACCESS_TOKEN_EXPIRY_DURATION',
        ) ?? '60s') as StringValue;
        return {
          global: true,
          secret: configService.get<string>('ACCESS_TOKEN_JWT_SECRET'),
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
    TypeOrmModule.forFeature([RefreshToken]),
    ConfigModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, ConfigService],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
