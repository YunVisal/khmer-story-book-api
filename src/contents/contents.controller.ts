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
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';

@Controller('contents')
@Serialize(ContentDto)
export class ContentsController {
  constructor(private contentService: ContentsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateContentDto, @CurrentUser() user: User) {
    return this.contentService.create(dto, user);
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
