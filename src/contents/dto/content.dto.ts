import { Expose } from 'class-transformer';

export class ContentDto {
  @Expose()
  id: number;

  @Expose()
  content: string;
}
