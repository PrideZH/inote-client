import axios from 'axios';
import { UserInfo } from '@/types/user';

export interface TokenVO {
  token: string;
  timeout: number;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface UserData {
  password?: string;
  nickname?: string;
  avatarUrl?: string;
  profile?: string;
}

const userApi = {

  getEmailCode (params: {email: string}) {
    return axios.post('/api/user/register/code', params);
  },

  register (params: {
    username: string,
    password: string,
    code: string
  }) {
    return axios.post('/api/user/register', params);
  },

  login (data: LoginData) {
    return axios.post<TokenVO>('/api/user/login', data);
  },

  logout () {
    return axios.post<TokenVO>('/api/user/logout');
  },

  refreshToken() {
    return axios.post('/api/admin/refreshToken');
  },

  get (id: number) {
  return axios.get<UserInfo>(`/api/user/${id}/open`);
  },

  getUserInfo () {
    return axios.get<UserInfo>('/api/user/me');
  },

  updateUser (id: number, userData: UserData) {
    return axios.patch<UserInfo>(`/api/user/${id}`, userData);
  }

}

export default userApi;
