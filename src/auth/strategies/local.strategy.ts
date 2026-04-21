import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { AuthLoginResponse } from 'src/auth/interfaces/auth-login-response.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    email: string,
    password: string,
  ): Promise<AuthLoginResponse> {
    const storeId = this.extractStoreId(req);
    const loginDto: LoginDto = { storeId, email, password };
    return this.authService.login(loginDto);
  }

  private extractStoreId(req: Request): string {
    const requestBody = req.body as Record<string, unknown>;
    const storeId = requestBody['storeId'];
    if (typeof storeId !== 'string' || storeId.length === 0) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return storeId;
  }
}
