// src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  role?: UserRole;
}