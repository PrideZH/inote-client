export interface UserInfo {
  id: number,
  username?: string;
  password?: string;
  nickname: string;
  avatarUrl: string | null;
  createTime?: Date;
  updateTime?: Date;
}
