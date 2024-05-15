import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateResponseUserDto } from './dto/res/create-response-user.dto';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  async createUser(
    body: CreateUserDto,
    file: any,
  ): Promise<Partial<CreateResponseUserDto>> {
    if (!body.email) {
      throw new Error('email wrong');
    }
    const findUser = await this.userModel.findOne({ email: body.email });

    if (findUser) {
      throw new BadRequestException('User already exist');
    }
    const resFile = await this.uploadFile(file);
    body.avatar = resFile;
    const user = await this.userModel.create(body);
    await this.mailerService.sendMail({
      to: [user.email],
      from: 'julasweta@ukr.net',
      subject: 'Created User',
      template: 'templateCreateUser',
      context: {
        name: user.first_name,
      },
    });
    return user;
  }

  async uploadFile(file: any) {
    const filePath = join(__dirname, '../../', file);

    const fileBuffer = fs.readFileSync(filePath);
    const fileBase64 = fileBuffer.toString('base64');

    return fileBase64;
  }
  async getUserById(id: string) {
    return await this.userModel.findById({ _id: id });
  }

  async getAvatar(userId: string): Promise<string | null> {
    const user = await this.userModel.findById(userId);
    return user?.avatar || null;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const avatarsFolder = join(__dirname, '../../avatars/');
    console.log(avatarsFolder);
    const filename = `${user.first_name + user.last_name}.jpeg`;
    console.log(filename);

    const filePath = join(avatarsFolder, filename);

    try {
      await fs.promises.unlink(filePath);
      const result = await this.userModel.deleteOne({ _id: userId });
      return result.deletedCount === 1;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}
