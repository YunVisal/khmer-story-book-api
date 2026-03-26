import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  coverImageUrl: string;

  @IsNotEmpty()
  @IsString()
  language: string;
}
