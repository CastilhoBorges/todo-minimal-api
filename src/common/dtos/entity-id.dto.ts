import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class EntityIdDTO {
  @ApiProperty({
    example: '40467e48-1c93-45c2-9ca5-2d4936b29596',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
