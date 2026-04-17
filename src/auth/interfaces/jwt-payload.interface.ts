import { UserRole } from 'src/users/entity/users.entity';

export interface JwtPayload {
  sub: string;
  storeId: string;
  branchId: number | null;
  role: UserRole;
}
