import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from './chapters.entity';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { BooksService } from 'src/books/books.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter) private repo: Repository<Chapter>,
    private bookService: BooksService,
  ) {}

  async create(dto: CreateChapterDto, user: User) {
    const book = await this.bookService.getById(dto.bookId);
    if (!book) {
      throw new BadRequestException('Book not found!');
    }

    const chapter = this.repo.create(dto);
    chapter.book = book;
    chapter.createdUser = user.id.toString();
    chapter.modifiedUser = user.id.toString();
    return this.repo.save(chapter);
  }

  async getAll() {
    return this.repo.find({
      where: { isDeleted: false },
      relations: { book: true },
    });
  }

  async getById(id: number) {
    return this.repo.findOneBy({ id });
  }
}
