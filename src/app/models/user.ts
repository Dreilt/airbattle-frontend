import { Role } from './role';

export class User {
  id: number;
  userName: string;
  email: string;
  role: Role;
  blocked: number;
}
