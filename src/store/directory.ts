import { DirectoryNode } from '@/types';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

// 保存目录相关信息
export const useDirStore = defineStore('directory', () => {

  // 当前激活的文件ID (点击或右键)
  const activeKey = ref<string | null>(null);
  // 当前展开的文件ID
  const expandedKeysJson: string | null = localStorage.getItem('expandedKeys');
  const expandedKeys = ref<string[]>(expandedKeysJson ? JSON.parse(expandedKeysJson) : []);

  // 保存目录展开状态
  watch(expandedKeys, () => {
    localStorage.setItem('expandedKeys', JSON.stringify(expandedKeys.value));
  }, { deep: true });

  return { activeKey, expandedKeys }
});
