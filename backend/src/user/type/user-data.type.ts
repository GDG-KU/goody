export type UserData = {
  id: number;
  userName: string;
  email: string;
  birthday: Date | null;
  profileImage: string | null;
  password?: string;
  refreshToken?: string | null;
};
