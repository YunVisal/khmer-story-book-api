import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './contents.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { ChaptersService } from 'src/chapters/chapters.service';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content) private repo: Repository<Content>,
    private chapterService: ChaptersService,
  ) {}

  async create(dto: CreateContentDto) {
    const chapter = await this.chapterService.getById(dto.chapterId);
    if (!chapter) {
      throw new BadRequestException('Chapter not found');
    }

    const content = this.repo.create(dto);
    content.chapter = chapter;
    content.createdUser = 'SYSTEM';
    content.modifiedUser = 'SYSTEM';
    return this.repo.save(content);
  }

  getById(id: number) {
    return this.repo.findOneBy({ id, isDeleted: false });
  }
}
