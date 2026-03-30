import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(dto: CreateUserDto) {
    const user = this.repo.create(dto);
    user.createdUser = 'SYSTEM';
    user.modifiedUser = 'SYSTEM';
    return this.repo.save(user);
  }

  getUserByEmail(email: string) {
    return this.repo.findBy({ email });
  }

  getUserById(id: number) {
    return this.repo.findOneBy({ id });
  }
}
