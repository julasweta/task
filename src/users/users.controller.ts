import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseMapper } from './dto/res/userResponseMapper';
import { CreateResponseUserDto } from './dto/res/create-response-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response, Request } from 'express';
import * as fs from 'fs';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './avatars',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async createUser(
    @Req() req: Request,
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<Partial<CreateResponseUserDto>> {
    const filename = `${createUserDto.first_name + createUserDto.last_name}.${avatar.mimetype.split('/')[1]}`;
    const finalPath = `${req.file.destination}/${filename}`;

    await fs.promises.rename(avatar.path, finalPath);
    const user = await this.usersService.createUser(createUserDto, finalPath);
    return UserResponseMapper.toResUserMapper(user);
  }

  @Get(':id')
  async getUserById(
    @Param('id') id: string,
  ): Promise<Partial<CreateResponseUserDto>> {
    const user = await this.usersService.getUserById(id);
    return UserResponseMapper.toResUserMapper(user);
  }

  @Get(':userId/avatar')
  async getAvatar(@Param('userId') userId: string, @Res() res: Response) {
    const avatar = await this.usersService.getAvatar(userId);
    if (!avatar) {
      throw new NotFoundException('Avatar not found');
    }

    res.send;
    res.type('image/jpeg').send(Buffer.from(avatar, 'base64'));
  }

  @Delete(':userId/avatar')
  async deleteUser(
    @Param('userId') userId: string,
  ): Promise<{ message: string }> {
    const success = await this.usersService.deleteUser(userId);
    if (!success) {
      throw new HttpException(
        'User not found or error during deletion',
        HttpStatus.NOT_FOUND,
      );
    }
    return { message: 'User successfully deleted' };
  }
}
