import { UserRole } from 'src/users/entity/users.entity';

interface AuthenticatedUserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeId: string;
  branchId: number | null;
}

export interface AuthLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthenticatedUserData;
}
