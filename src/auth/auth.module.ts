import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { StringValue } from 'ms';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  AUTH_REFRESH_OPTIONS,
  RefreshTokenOptions,
} from './constants/jwt.constants';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET', 'dev-secret');
        const accessExpiresIn =
          configService.get<StringValue>('JWT_EXPIRES_IN') ?? '1d';
        return {
          secret,
          signOptions: {
            expiresIn: accessExpiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: AUTH_REFRESH_OPTIONS,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): RefreshTokenOptions => {
        const refreshSecret = configService.get<string>(
          'JWT_REFRESH_SECRET',
          'dev-refresh-secret',
        );
        const refreshExpiresIn =
          configService.get<StringValue>('JWT_REFRESH_EXPIRES_IN');
        return {
          secret: refreshSecret,
          expiresIn: refreshExpiresIn ?? '7d',
        };
      },
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
