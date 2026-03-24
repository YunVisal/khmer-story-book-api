import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  NotFoundException,
  Patch,
  Delete,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
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

  @Get(':id')
  async get(@Param('id') id: number) {
    const user = await this.bookService.get(id);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateBookDto) {
    return this.bookService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.bookService.delete(id);
  }
}
