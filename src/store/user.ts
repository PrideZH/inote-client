import { getUserInfo } from '@/api/user';
import { UserInfo } from '@/types/user';
import { isLogin } from '@/utils/auth';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null);

  if (isLogin()) {
    getUserInfo().then(res => userInfo.value = res.data);
  }

  const avatarUrl = computed((): string => {
    if (userInfo.value !== null && userInfo.value.avatarUrl !== null) {
      return `${import.meta.env.VITE_APP_BASE_URL}/${userInfo.value.avatarUrl}`;
    } else {
      return '';
    }
  });

  return { avatarUrl, userInfo };
});
