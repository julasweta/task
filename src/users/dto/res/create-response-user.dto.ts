import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../create-user.dto';

export class CreateResponseUserDto extends PickType(CreateUserDto, [
  '_id',
  'email',
  'first_name',
  'last_name',
  'avatar',
]) {
  support: {
    url: string;
    text: string;
  };
}
