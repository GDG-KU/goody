export type UserData = {
  userId: number;
  userName: string;
  email: string;
  birthday: Date | null;
  profileImage: string | null;
  password?: string;
  refreshToken?: string | null;
};
