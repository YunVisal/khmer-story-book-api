import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from './chapters.entity';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { BooksService } from 'src/books/books.service';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter) private repo: Repository<Chapter>,
    private bookService: BooksService,
  ) {}

  async create(dto: CreateChapterDto) {
    const book = await this.bookService.getById(dto.bookId);
    if (!book) {
      throw new BadRequestException('Book not found!');
    }

    const chapter = this.repo.create(dto);
    chapter.book = book;
    chapter.createdUser = 'SYSTEM';
    chapter.modifiedUser = 'SYSTEM';
    return this.repo.save(chapter);
  }

  async getAll() {
    return this.repo.findBy({ isDeleted: false });
  }
}
