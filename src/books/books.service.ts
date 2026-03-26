import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './books.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(@InjectRepository(Book) private repo: Repository<Book>) {}

  create(dto: CreateBookDto) {
    const book = this.repo.create(dto);
    book.createdUser = 'SYSTEM';
    book.modifiedUser = 'SYSTEM';
    return this.repo.save(book);
  }

  getAll() {
    return this.repo.findBy({ isDeleted: false });
  }

  getById(id: number) {
    return this.repo.findOneBy({ id, isDeleted: false });
  }
}
