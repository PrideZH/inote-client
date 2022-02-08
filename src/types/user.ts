export interface UserInfo {
  id: number,
  username?: string;
  password?: string;
  nickname: string;
  avatarUrl?: string;
  createTime?: Date;
  updateTime?: Date;
}
