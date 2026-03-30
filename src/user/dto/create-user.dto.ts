import { Expose } from 'class-transformer';

export class CreateUserDto {
  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  dob: Date;

  salt: string;

  hash: string;
}
