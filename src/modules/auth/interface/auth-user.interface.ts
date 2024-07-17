import { EUserRole } from 'src/enums/roles.enum';

export interface IAuthUser {
  _id: string;
  email: string;
  fullName?: string;
  avatar?: string;
  emailVerifiedAt?: Date;
  role?: EUserRole;
  iat?: number;
  exp?: number;
  isActive?: boolean;
}
