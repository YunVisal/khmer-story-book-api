import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ChapterDto } from './dto/chapter.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('chapters')
@Serialize(ChapterDto)
export class ChaptersController {
  constructor(private chapterService: ChaptersService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateChapterDto) {
    return this.chapterService.create(dto);
  }

  @Get()
  getAll() {
    return this.chapterService.getAll();
  }
}
