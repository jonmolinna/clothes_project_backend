import {
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  AUTH_REFRESH_OPTIONS,
} from 'src/auth/constants/jwt.constants';
import type { RefreshTokenOptions } from 'src/auth/constants/jwt.constants';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RefreshTokenDto } from 'src/auth/dto/refresh-token.dto';
import { AuthTokens } from 'src/auth/interfaces/auth-tokens.interface';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(AUTH_REFRESH_OPTIONS)
    private readonly refreshTokenOptions: RefreshTokenOptions,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailAndStore(dto.email, dto.storeId);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.store?.id) {
      throw new UnprocessableEntityException('Usuario sin tienda asociada');
    }

    const payload = this.buildPayload(user);
    const tokens = await this.signTokens(payload);

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeId: user.store.id,
        branchId: user.branch?.id ?? null,
      },
    };
  }

  async refreshTokens(dto: RefreshTokenDto): Promise<AuthTokens> {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(dto.refreshToken, {
        secret: this.refreshTokenOptions.secret,
      });
    } catch {
      throw new UnauthorizedException('Token inválido');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.isActive || !user.store?.id) {
      throw new UnauthorizedException('Token inválido');
    }

    return this.signTokens(this.buildPayload(user));
  }

  private buildPayload(user: {
    id: string;
    role: JwtPayload['role'];
    store?: { id: string } | null;
    branch?: { id: number } | null;
  }): JwtPayload {
    if (!user.store?.id) {
      throw new UnprocessableEntityException('Usuario sin tienda asociada');
    }

    return {
      sub: user.id,
      role: user.role,
      storeId: user.store.id,
      branchId: user.branch?.id ?? null,
    };
  }

  private async signTokens(payload: JwtPayload): Promise<AuthTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.refreshTokenOptions.secret,
        expiresIn: this.refreshTokenOptions.expiresIn,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
