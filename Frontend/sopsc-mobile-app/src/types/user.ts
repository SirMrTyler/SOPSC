export interface UserResult {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  dateCreated: string;
  lastLoginDate: string | null;
  isActive: boolean;
  roleId: number;
}