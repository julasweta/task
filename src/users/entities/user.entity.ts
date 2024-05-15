import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail } from 'class-validator';

@Schema()
export class User extends Document {
  @ApiProperty()
  @IsEmail()
  @Prop()
  email: string;

  @ApiProperty()
  @Prop()
  first_name: string;

  @ApiProperty()
  @Prop()
  last_name: string;

  @ApiProperty()
  @Prop()
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
