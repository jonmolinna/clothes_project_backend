import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { RefreshTokenOptions } from 'src/auth/constants/jwt.constants';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/entity/users.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { findByEmailAndStore: jest.Mock; findById: jest.Mock };
  let jwtService: { signAsync: jest.Mock; verifyAsync: jest.Mock };
  let refreshTokenOptions: RefreshTokenOptions;

  beforeEach(() => {
    usersService = {
      findByEmailAndStore: jest.fn(),
      findById: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    };
    refreshTokenOptions = {
      secret: 'refresh-secret',
      expiresIn: '7d',
    };
    service = new AuthService(
      usersService as unknown as UsersService,
      jwtService as unknown as JwtService,
      refreshTokenOptions,
    );
  });

  it('returns access and refresh tokens when credentials are valid', async () => {
    const hashedPassword = await bcrypt.hash('secret123', 10);
    usersService.findByEmailAndStore.mockResolvedValue({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      role: UserRole.CAJERO,
      isActive: true,
      passwordHash: hashedPassword,
      store: { id: 'store-1' },
      branch: { id: 10 },
    });
    jwtService.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');

    const result = await service.login({
      storeId: 'store-1',
      email: 'test@example.com',
      password: 'secret123',
    });

    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(jwtService.signAsync).toHaveBeenNthCalledWith(
      1,
      {
        sub: 'user-1',
        role: UserRole.CAJERO,
        storeId: 'store-1',
        branchId: 10,
      },
    );
    expect(jwtService.signAsync).toHaveBeenNthCalledWith(
      2,
      {
        sub: 'user-1',
        role: UserRole.CAJERO,
        storeId: 'store-1',
        branchId: 10,
      },
      {
        secret: 'refresh-secret',
        expiresIn: '7d',
      },
    );
  });

  it('throws when password is invalid', async () => {
    const hashedPassword = await bcrypt.hash('secret123', 10);
    usersService.findByEmailAndStore.mockResolvedValue({
      id: 'user-1',
      isActive: true,
      passwordHash: hashedPassword,
      role: UserRole.ADMIN,
      store: { id: 'store-1' },
      branch: null,
    });

    await expect(
      service.login({
        storeId: 'store-1',
        email: 'test@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('refreshes tokens with a valid refresh token', async () => {
    jwtService.verifyAsync.mockResolvedValue({
      sub: 'user-1',
      role: UserRole.ADMIN,
      storeId: 'store-1',
      branchId: null,
    });
    usersService.findById.mockResolvedValue({
      id: 'user-1',
      role: UserRole.ADMIN,
      isActive: true,
      store: { id: 'store-1' },
      branch: null,
    });
    jwtService.signAsync
      .mockResolvedValueOnce('new-access-token')
      .mockResolvedValueOnce('new-refresh-token');

    const result = await service.refreshTokens({
      refreshToken: 'valid-token',
    });

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
      secret: 'refresh-secret',
    });
    expect(result).toEqual({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
  });

  it('throws when refresh token is invalid', async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error('invalid-token'));

    await expect(
      service.refreshTokens({
        refreshToken: 'invalid-token',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
