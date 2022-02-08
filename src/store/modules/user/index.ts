import { getUserInfo } from '@/api/user';
import { UserInfo } from '@/types/user';
import { isLogin } from '@/utils/auth';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { UserState } from './types';

export const useUserStore = defineStore('user', (): UserState => {
  const userInfo = ref<UserInfo | null>(null);

  if (isLogin()) {
    getUserInfo().then(res => userInfo.value = res.data);
  }

  return { userInfo };
});
