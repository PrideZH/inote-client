import axios from 'axios';
import { UserInfo } from '@/types/user';
import { Token } from '@/types/global';

export interface LoginData {
  username: string,
  password: string
}

export function login(data: LoginData) {
  return axios.post<Token>('/api/user/login', data);
}

export function logout() {
  return axios.post<Token>('/api/user/logout');
}

export function getUserInfo() {
  return axios.get<UserInfo>('/api/user/me');
}
