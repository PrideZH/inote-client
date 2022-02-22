import axios from 'axios';
import { UserInfo } from '@/types/user';
import { Token } from '@/types/global';

export interface LoginData {
  username: string;
  password: string;
}

export interface UserData {
  password?: string;
  nickname?: string;
  avatarUrl?: string;
}

const userApi = {

  login (data: LoginData) {
    return axios.post<Token>('/api/user/login', data);
  },

  logout () {
    return axios.post<Token>('/api/user/logout');
  },

  getUserInfo () {
    return axios.get<UserInfo>('/api/user/me');
  },

  updateUser (id: number, userData: UserData) {
    return axios.patch<UserInfo>(`/api/user/${id}`, userData);
  }

}

export default userApi;
