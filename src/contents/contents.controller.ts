import {
  Controller,
  Param,
  Post,
  Get,
  NotFoundException,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ContentsService } from './contents.service';
import { CreateContentDto } from './dto/create-content.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ContentDto } from './dto/content.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('contents')
@Serialize(ContentDto)
export class ContentsController {
  constructor(private contentService: ContentsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateContentDto) {
    return this.contentService.create(dto);
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    const content = await this.contentService.getById(id);
    if (!content) {
      throw new NotFoundException();
    }
    return content;
  }
}
