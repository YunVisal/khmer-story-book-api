import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(@InjectRepository(Book) private repo: Repository<Book>) {}

  create(dto: CreateBookDto) {
    const book = this.repo.create(dto);
    book.IsDeleted = false;
    return this.repo.save(book);
  }

  getAll() {
    return this.repo.findBy({ IsDeleted: false });
  }

  get(id: number) {
    return this.repo.findOneBy({ id, IsDeleted: false });
  }

  async update(id: number, attr: Partial<Book>) {
    const existingBook = await this.get(id);
    if (!existingBook) {
      throw new BadRequestException();
    }

    Object.assign(existingBook, attr);
    return this.repo.save(existingBook);
  }

  async delete(id: number) {
    const existingBook = await this.get(id);
    if (!existingBook) {
      throw new BadRequestException();
    }
    existingBook.IsDeleted = true;
    return this.repo.save(existingBook);
  }
}
