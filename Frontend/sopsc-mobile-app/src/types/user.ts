export interface UserResult {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePicturePath?: string;
  dateCreated: string;
  lastLoginDate: string | null;
  isActive: boolean;
  roleId: number;
}