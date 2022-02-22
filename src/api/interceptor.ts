import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { clearToken, getToken } from '@/utils/auth';
import { useAppStore } from '@/store';
import { ElMessage } from 'element-plus';
import userApi from './user';
import router from '@/router';

export const TIMEOUT: number = 30 * 1000;

export interface HttpResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

let timer: NodeJS.Timer | null = null;

axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL as string;
axios.defaults.timeout = TIMEOUT;

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const appStore = useAppStore();
    // 进度条
    appStore.loadPercent = 0;
    appStore.isLoad = true;
    if (timer !== null) clearInterval(timer);
    timer = setInterval(() => {
      appStore.loadPercent += 10000 / TIMEOUT;
    }, 100);

    if (config.headers) {
      const token: string | null = getToken();
      if (token) config.headers['token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const appStore = useAppStore();
    appStore.loadPercent = 100;
    if (timer !== null) clearInterval(timer);
    setTimeout(() => appStore.isLoad = false, 200);

    // 第三方接口
    if (response.data.code === undefined) {
      return Promise.resolve(response as any);
    }

    const res: HttpResponse<unknown> = response.data;
    if (res.code !== 200) {
      ElMessage.error(`[${res.code}] ${res.message} ${res.data ? res.data : ''}`);
      // 401: token 无效
      if ([401].includes(res.code)) {
        userApi.logout();
        clearToken();
        router.push('/home/login');
      }
      return Promise.reject(res);
    }
    return res;
  },
  (error) => {
    const appStore = useAppStore();
    if (timer !== null) clearInterval(timer);
    appStore.isLoad = false;
    ElMessage.error(error.message);
    return Promise.reject(error);
  }
);
