import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findByEmailAndStore(email: string, storeId: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: {
        email: email.toLowerCase().trim(),
        store: { id: storeId },
      },
      relations: ['store', 'branch'],
    });
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['store', 'branch'],
    });
  }
}
