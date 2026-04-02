import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './books/books.entity';
import { ChaptersModule } from './chapters/chapters.module';
import { Chapter } from './chapters/chapters.entity';
import { ContentsModule } from './contents/contents.module';
import { Content } from './contents/contents.entity';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { RefreshToken } from './auth/refresh-token.entity';
import {
  DB_HOST_CONFIG_KEY,
  DB_NAME_CONFIG_KEY,
  DB_PASSWORD_CONFIG_KEY,
  DB_SYNCHRONIZE_CONFIG_KEY,
  DB_USERNAME_CONFIG_KEY,
  DB_TYPE,
} from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: DB_TYPE,
          host: config.get<string>(DB_HOST_CONFIG_KEY),
          username: config.get<string>(DB_USERNAME_CONFIG_KEY),
          password: config.get<string>(DB_PASSWORD_CONFIG_KEY),
          database: config.get<string>(DB_NAME_CONFIG_KEY),
          synchronize: config.get<boolean>(DB_SYNCHRONIZE_CONFIG_KEY),
          ssl: true,
          entities: [Book, Chapter, Content, User, RefreshToken],
        };
      },
    }),
    BooksModule,
    ChaptersModule,
    ContentsModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
