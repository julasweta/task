import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @ApiProperty({ type: String, format: 'ObjectId' }) // Для Swagger
  _id?: Types.ObjectId;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsString()
  last_name: string;

  @ApiProperty({ type: 'string', format: 'binary' }) // Додайте цей рядок для Swagger
  avatar: string; // Змініть тип на string
}
