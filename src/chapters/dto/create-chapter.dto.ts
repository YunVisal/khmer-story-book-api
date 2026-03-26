import { IsNumber, IsString } from 'class-validator';

export class CreateChapterDto {
  @IsString()
  title: string;

  @IsNumber()
  chapterNumber: number;

  @IsNumber()
  bookId: number;
}
