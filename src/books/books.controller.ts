import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { BooksService } from './books.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { BookDto } from './dto/book.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';

@Controller('books')
@Serialize(BookDto)
export class BooksController {
  constructor(private bookService: BooksService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateBookDto, @CurrentUser() user: User) {
    return this.bookService.create(dto, user);
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
