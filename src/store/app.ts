import { Config } from '@/types/global';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';

export const useAppStore = defineStore('app', () => {

  // 系统
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

  // 笔记全屏
  const fullscreen = ref<boolean>(false);
  // 全局加载
  const isLoad = ref<boolean>(false);
  // 加载百分比
  const loadPercent = ref<number>(0);

  // 持久化配置
  const __configJson: string | null = localStorage.getItem('inote-config');
  const config = reactive<Config>(__configJson ? JSON.parse(__configJson) : {
    filterContent: '',
  });
  // 保存配置
  const saveConfig = () => {
    localStorage.setItem('inote-config', JSON.stringify(config));
  }

  const isMobile = computed(() => {
    return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  });

  return { BASE_URL, fullscreen, isLoad, loadPercent, config, saveConfig, isMobile }
});
