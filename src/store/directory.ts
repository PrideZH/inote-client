import { DirectoryNode } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

// 保存目录相关信息
export const useDirStore = defineStore('directory', () => {

  // 文件目录信息
  //const directory = ref<DirectoryNode[]>([]);
  // 当前激活的文件ID (点击或右键)
  const activeKey = ref<string | null>(null);
  // 当前展开的文件ID
  const expandedKeys: string[] = [];

  // 刷新数据
  const refresh = () => {
    // 通过展开的文件加载信息
    // folderApi.getFolderTree().then(res => folderTree.value = res.data);
    // if (folderStore.currentFolder !== null) {
    //   folderApi.getRelevance(folderStore.currentFolder.id).then(res => notes.value = res.data);
    // }
  };
  refresh();

  return { activeKey, expandedKeys, refresh }
});
