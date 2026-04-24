import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { AuthLoginResponse } from 'src/auth/interfaces/auth-login-response.interface';

interface TenantRequestData {
  storeSlug?: string;
}

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
    const storeSlug = this.extractStoreSlug(req);
    const loginDto: LoginDto = { email, password };
    return this.authService.login({ ...loginDto, storeSlug });
  }

  private extractStoreSlug(req: Request): string {
    const host = this.extractHost(req);
    const hostname = this.extractHostname(host);
    const slugFromHost = this.extractSlugFromHostname(hostname);
    if (slugFromHost) {
      return slugFromHost;
    }
    const requestData = req.body as TenantRequestData;
    const slugFromBody = requestData.storeSlug;
    if (slugFromBody && slugFromBody.trim().length > 0) {
      return slugFromBody.trim().toLowerCase();
    }
    const tenantHeader = req.headers['x-tenant-slug'];
    if (typeof tenantHeader === 'string' && tenantHeader.trim().length > 0) {
      return tenantHeader.trim().toLowerCase();
    }
    if (Array.isArray(tenantHeader) && tenantHeader.length > 0) {
      return tenantHeader[0].trim().toLowerCase();
    }
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      throw new UnauthorizedException(
        'Tenant no encontrado. En local usa x-tenant-slug o storeSlug',
      );
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }
  private extractHost(req: Request): string {
    const forwardedHostHeader = req.headers['x-forwarded-host'];
    if (typeof forwardedHostHeader === 'string' && forwardedHostHeader.length > 0) {
      const [firstHost] = forwardedHostHeader.split(',');
      return firstHost.trim();
    }
    if (Array.isArray(forwardedHostHeader) && forwardedHostHeader.length > 0) {
      return forwardedHostHeader[0].trim();
    }
    const hostHeader = req.headers.host;
    if (hostHeader && hostHeader.length > 0) {
      return hostHeader.trim();
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }
  private extractHostname(host: string): string {
    const [hostname] = host.toLowerCase().split(':');
    return hostname;
  }
  private extractSlugFromHostname(hostname: string): string | null {
    const hostSegments = hostname.split('.').filter((segment) => segment.length > 0);
    if (hostSegments.length < 3) {
      return null;
    }
    const [tenantSlug] = hostSegments;
    if (!tenantSlug || tenantSlug === 'www') {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return tenantSlug;
  }
}
