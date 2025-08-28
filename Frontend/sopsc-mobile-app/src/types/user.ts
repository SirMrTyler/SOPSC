export interface UserResult {
  userId: number;
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  profilePicturePath?: string;
  dateCreated: string;
  lastLoginDate: string | null;
  isActive: boolean;
  roleId: number;
  divisionId?: number;
  firebaseUid: string;
}