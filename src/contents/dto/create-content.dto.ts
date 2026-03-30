import { IsNumber, IsString } from 'class-validator';

export class CreateContentDto {
  @IsNumber()
  chapterId: number;

  @IsString()
  content: string;
}
