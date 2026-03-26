import { Expose, Transform } from 'class-transformer';
import { Chapter } from '../chapters.entity';

export class ChapterDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  chapterNumber: number;

  @Transform(({ obj }) => (obj as Chapter).book?.id ?? null)
  @Expose()
  bookId: number;
}
