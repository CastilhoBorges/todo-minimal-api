import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPassword } from '../../common/decorators/is-password.decorator';

export class CreateUserDTO {
  @ApiProperty({
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'johndoe@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example:
      'PnF494nmrV*dPYdR5nhVsz95eLNYgddOf3STCqCcIm$FDViwxTk4&lHZuZzfUW#Gwon6Bpq&wEvssWZkQPmtHkjEavNBGT7CjzYFHq*0^ERw@L330q$suVqDtwgLYBwz',
  })
  @IsNotEmpty()
  @IsPassword()
  password: string;
}
