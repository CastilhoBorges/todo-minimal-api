import { ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDTO } from './user.dtos';
import { UserService } from './user.service';
import { EntityIdDTO } from '../../common/dtos/entity-id.dto';
import { User } from './user.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({ type: EntityIdDTO })
  async createUser(@Body() dto: CreateUserDTO): Promise<EntityIdDTO> {
    return await this.userService.createUser(dto);
  }
}
