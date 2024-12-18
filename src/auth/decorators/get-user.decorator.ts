import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

export const GetUser = createParamDecorator(
  async (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException();
    }

    const configService = new ConfigService();
    const authUrl = configService.get('AUTH_SERVICE_URL');

    if (!authUrl) {
      throw new Error('AUTH_SERVICE_URL is not defined in .env');
    }

    const httpService = new HttpService();

    try {
      const response: AxiosResponse = await firstValueFrom(
        httpService.get(`${authUrl}/auth/me`, {
          headers: {
            Authorization: token,
          },
        }),
      );

      const userData = response.data;
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new UnauthorizedException('Failed to fetch user data');
    }
  },
);
