import { Config } from '@/types/global';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useAppStore = defineStore('app', () => {

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

  return { isLoad, loadPercent, config, saveConfig }
});
