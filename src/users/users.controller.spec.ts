import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const req = {}; // Передайте пустий об'єкт, оскільки вам не потрібен об'єкт запиту для цього тесту
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: 'avatar.jpg',
      };
      const avatar = {}; // Передайте пустий об'єкт для об'єкту avatar, оскільки цей тест не залежить від нього

      jest
        .spyOn(userService, 'createUser')
        .mockResolvedValueOnce(createUserDto);

      const result = await controller.createUser(
        req as any,
        createUserDto,
        avatar as any,
      );

      expect(result).toEqual(createUserDto);
    });
  });
});
