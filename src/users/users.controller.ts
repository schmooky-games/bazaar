import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto, LoginUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.usersService.register(dto);
  }

  // @Get('verify-email')
  // async verifyEmail(@Query('token') token: string) {
  //   return this.usersService.verifyEmail(token);
  // }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    const token = await this.usersService.login(dto);
    return token;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  getProfile() {
    return { message: 'Protected route' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    return { message: 'Successfully logged out' };
  }
}
