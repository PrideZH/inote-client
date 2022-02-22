import { defineStore } from 'pinia';
import { nextTick, ref, watch } from 'vue';

// 保存目录相关信息
export const useDirStore = defineStore('directory', () => {

  // 模式 云文件目录|最近编辑|未关联文件|图片
  const mode = ref<'directory' | 'discrete' | 'recentness' | 'image'>('directory');
  // 激活模式
  const activeMode = ref<'directory' | 'discrete' | 'recentness' | 'image'>('directory');
  // 当前激活的文件ID (点击或右键)
  const activeKey = ref<string | null>(null);
  // 当前展开的文件夹ID 当mode为directory时
  const expandedKeysJson: string | null = localStorage.getItem('expandedKeys');
  const expandedKeys = ref<string[]>(expandedKeysJson ? JSON.parse(expandedKeysJson) : []);

  // 保存目录展开状态 当mode为directory时
  watch(expandedKeys, () => {
    localStorage.setItem('expandedKeys', JSON.stringify(expandedKeys.value));
  }, { deep: true });

  // 刷新目录
  const treeRefresh = ref<boolean>(true);
  const refreshTree = () => {
    treeRefresh.value = false;
    nextTick(() => {
      treeRefresh.value = true;
    });
  }

  return { mode, activeMode, activeKey, expandedKeys, treeRefresh, refreshTree }
});
