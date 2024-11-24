export type UserBaseInfo = {
  id: number;
  userName: string;
  email: string;
  birthday: Date | null;
  profileImage: string | null;
  password: string;
  refreshToken: string | null;
};
