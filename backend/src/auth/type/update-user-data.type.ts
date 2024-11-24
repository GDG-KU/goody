export type UpdateUserData = {
  email?: string;
  password?: string;
  userName?: string;
  birthday?: Date | null;
  profileImage?: string | null;
  refreshToken?: string | null;
};
