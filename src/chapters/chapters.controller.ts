import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ChapterDto } from './dto/chapter.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';

@Controller('chapters')
@Serialize(ChapterDto)
export class ChaptersController {
  constructor(private chapterService: ChaptersService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateChapterDto, @CurrentUser() user: User) {
    return this.chapterService.create(dto, user);
  }

  @Get()
  getAll() {
    return this.chapterService.getAll();
  }
}
