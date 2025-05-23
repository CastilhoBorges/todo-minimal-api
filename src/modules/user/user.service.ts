import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from './user.dtos';
import { User } from './user.entity';
import { EmailExistsException } from './user.exception';
import { EntityIdDTO } from '../../common/dtos/entity-id.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(dto: CreateUserDTO): Promise<EntityIdDTO> {
    const { name, email, password } = dto;
    const salt = 10;

    await this.validateUserExist(email);

    const passwordHash = await hash(password, salt);

    const newUser: DeepPartial<User> = {
      name,
      email,
      password: passwordHash,
    };

    const userCreated = await this.userRepository.create(newUser);
    const user = (await this.userRepository.save(userCreated)) as User;

    return {
      id: user.id,
    };
  }

  private async validateUserExist(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new EmailExistsException();
    }

    return;
  }
}
