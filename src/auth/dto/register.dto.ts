import { IsDateString, IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsDateString()
  dob: string;

  @IsString()
  password: string;
}
