import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { BooksService } from './books.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { BookDto } from './dto/book.dto';

@Controller('books')
@Serialize(BookDto)
export class BooksController {
  constructor(private bookService: BooksService) {}

  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.bookService.create(dto);
  }

  @Get()
  getAll() {
    return this.bookService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    const book = await this.bookService.getById(id);
    if (!book) {
      throw new NotFoundException();
    }

    return book;
  }
}
