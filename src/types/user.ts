export interface UserInfo {
  id: number,
  username?: string;
  password?: string;
  nickname: string;
  avatarUrl: string | null;
  profile: string;
  createTime?: Date;
  updateTime?: Date;
}
