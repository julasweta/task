import { CreateUserDto } from './../create-user.dto';
import { CreateResponseUserDto } from './create-response-user.dto';

export class UserResponseMapper {
  static toResUserMapper(
    data: Partial<CreateUserDto>,
  ): Partial<CreateResponseUserDto> {
    return {
      _id: data?._id,
      email: data?.email,
      first_name: data?.first_name,
      last_name: data?.last_name,
      avatar: data?.avatar,
      support: {
        url: 'https://reqres.in/#support-heading',
        text: 'To keep ReqRes free, contributions towards server costs are appreciated!',
      },
    };
  }
}
