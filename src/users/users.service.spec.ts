import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel;
  let mockMailerService;

  beforeEach(async () => {
    mockUserModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
      deleteOne: jest.fn(),
    };
    mockMailerService = {
      sendMail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should successfully create a user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      };
      const mockFile = 'mockFileBuffer';
      const mockCreateResponse = {
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        avatar: 'base64imagestring',
      };

      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(mockCreateResponse);
      mockMailerService.sendMail.mockResolvedValue(true);
      jest
        .spyOn(service, 'uploadFile')
        .mockResolvedValueOnce('base64imagestring');

      const result = await service.createUser(new CreateUserDto(), mockFile);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(mockUserModel.create).toHaveBeenCalledWith(CreateUserDto);
      expect(mockMailerService.sendMail).toHaveBeenCalled();
      expect(service.uploadFile).toHaveBeenCalledWith(mockFile);
      expect(result).toEqual(mockCreateResponse);
    });

    it('should throw error when user already exists', async () => {
      const createUserDto = {
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      };
      const mockFile = 'mockFileBuffer';
      const existingUser = { ...createUserDto, id: '1' };

      mockUserModel.findOne.mockResolvedValue(existingUser);

      await expect(
        service.createUser(new CreateUserDto(), mockFile),
      ).rejects.toThrow();
    });
  });
});
