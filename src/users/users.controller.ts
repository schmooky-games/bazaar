import { Controller, Post, Body, Res, Get, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { RegisterUserDto, LoginUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.usersService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) response: Response<any, Record<string, any>>,
  ) {
    await this.usersService.login(dto, response);
    return { message: 'Successfully logged in' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile() {
    return { message: 'Protected route' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) response: Response<any, Record<string, any>>,
  ) {
    await this.usersService.logout(response);
    return { message: 'Successfully logged out' };
  }
}
