import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { RegisterUserDto, LoginUserDto } from './dto/user.dto';
import { Response } from 'express';
import { createId } from '@paralleldrive/cuid2';
// import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    // private mailService: MailService,
  ) {}

  async register(dto: RegisterUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });

    if (existingUser) {
      throw new UnauthorizedException(
        'User with this email or username already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      id: createId(),
      ...dto,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // const savedUser = await this.userRepository.save(user);

    // const token = this.jwtService.sign(
    //   { email: user.email },
    //   { secret: 'email-verification-secret', expiresIn: '1h' },
    // );

    // await this.mailService.sendVerificationEmail(user.email, token);

    // return savedUser;
    return this.userRepository.save(user);
  }

  // async verifyEmail(token: string): Promise<string> {
  //   try {
  //     const decoded = this.jwtService.verify(token, {
  //       secret: 'email-verification-secret',
  //     });
  //     const email = decoded.email;

  //     const user = await this.userRepository.findOne({ where: { email } });
  //     if (!user) {
  //       throw new UnauthorizedException('Invalid token or user not found');
  //     }

  //     return `Email ${email} успешно подтвержден!`;
  //   } catch (error) {
  //     throw new BadRequestException('Неверный или истёкший токен');
  //   }
  // }

  async login(dto: LoginUserDto): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async logout(response: Response<any, Record<string, any>>): Promise<void> {}
}
