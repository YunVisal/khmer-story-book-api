import { Controller, Post, Body, Get } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ChapterDto } from './dto/chapter.dto';

@Controller('chapters')
@Serialize(ChapterDto)
export class ChaptersController {
  constructor(private chapterService: ChaptersService) {}

  @Post()
  create(@Body() dto: CreateChapterDto) {
    return this.chapterService.create(dto);
  }

  @Get()
  getAll() {
    return this.chapterService.getAll();
  }
}
