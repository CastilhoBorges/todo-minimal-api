import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/config/base/base-repository';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository);
  }
}
