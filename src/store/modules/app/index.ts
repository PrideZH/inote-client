import { defineStore } from 'pinia';
import { ref } from 'vue';
import { AppState } from './types';

export const useAppStore = defineStore('app', (): AppState => {
  const isCollapse = ref<boolean>(false);
  const isLoad = ref<boolean>(false);
  const loadPercent = ref<number>(0);

  return { isCollapse, isLoad, loadPercent };
});
