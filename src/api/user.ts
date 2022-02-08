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

export function login(data: LoginData) {
  return axios.post<Token>('/api/user/login', data);
}

export function logout() {
  return axios.post<Token>('/api/user/logout');
}

export function getUserInfo() {
  return axios.get<UserInfo>('/api/user/me');
}

export function updateUser(id: number, userData: UserData) {
  return axios.patch<UserInfo>(`/api/user/${id}`, userData);
}
