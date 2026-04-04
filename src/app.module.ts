import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChaptersModule } from './chapters/chapters.module';
import { ContentsModule } from './contents/contents.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppDataSourceOption } from './database/database-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot(AppDataSourceOption),
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
