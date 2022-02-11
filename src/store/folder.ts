import { folderApi } from '@/api';
import { FolderTree } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFolderStore = defineStore('folder', () => {
  const folderTree = ref<FolderTree[]>([]);
  const currentFolder = ref<FolderTree | null>(null);
  const defaultExpandedKeys: number[] = [];

  const refresh = () => folderApi.getFolderTree().then(res => folderTree.value = res.data);
  refresh();

  const getPath = (id: number): string | null => {
    const __getPath = (folders: FolderTree[], id: number): string | null => {
      for (let i = 0; i < folders.length; i++) {
        if (folders[i].id === id) return folders[i].name;
        const res = __getPath(folders[i].children || [], id);
        if (res !== null) return `${folders[i].name}\\${res}`;
      }
      return null;
    }
    return __getPath(folderTree.value, id);
  }

  const getFolderById = (id: number): FolderTree | null => {
    const get = (folders: FolderTree[], id: number): FolderTree | null => {
      for (let i = 0; i < folders.length; i++) {
        if (folders[i].id === id) return folders[i];
        const res = get(folders[i].children || [], id);
        if (res !== null) return res;
      }
      return null;
    }
    return get(folderTree.value, id);
  };

  const getParent = (id: number): FolderTree | null => {
    const get = (folders: FolderTree[], parend: FolderTree | null, id: number): FolderTree | null => {
      for (let i = 0; i < folders.length; i++) {
        if (folders[i].id === id) return parend;
        const res = get(folders[i].children || [], folders[i], id);
        if (res !== null) return res;
      }
      return null;
    }
    return get(folderTree.value, null, id);
  };

  return {
    folderTree,
    currentFolder,
    defaultExpandedKeys,
    refresh,
    getPath,
    getFolderById,
    getParent
  };
});
