import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: 'user1',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'user1@mail.ru',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'pswd1234',
  })
  @IsString()
  password: string;
}

export class LoginUserDto {
  @ApiProperty({
    example: 'user1@mail.ru',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'pswd1234',
  })
  @IsString()
  password: string;
}
