import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
