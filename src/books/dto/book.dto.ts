import { Expose } from 'class-transformer';

export class BookDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  author: string;

  @Expose()
  description: string;

  @Expose()
  coverImageUrl: string;

  @Expose()
  language: string;
}
