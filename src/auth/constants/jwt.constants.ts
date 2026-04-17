import type { StringValue } from 'ms';

export const AUTH_REFRESH_OPTIONS = 'AUTH_REFRESH_OPTIONS';

export interface RefreshTokenOptions {
  secret: string;
  expiresIn: StringValue | number;
}
