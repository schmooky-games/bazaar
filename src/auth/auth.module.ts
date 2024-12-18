import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { RedisModule } from 'src/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [RedisModule, JwtModule, ConfigModule.forRoot()],
  exports: [JwtAuthGuard],
  providers: [JwtAuthGuard],
})
export class AuthModule {}
