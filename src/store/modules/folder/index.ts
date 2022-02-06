import { getFolderTree } from '@/api/folder';
import { FolderTree } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { FolderState } from './types';

export const useFolderStore = defineStore('folder', (): FolderState => {
  const folderTree = ref<FolderTree[]>([]);
  const currentFolder = ref<FolderTree | null>(null);
  const defaultExpandedKeys: number[] = [];

  getFolderTree().then(res => folderTree.value = res.data);

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
  }

  const addFolderTree = (folder: FolderTree, parentId: number) => {
    if (parentId === 0) {
      folderTree.value.push(folder);
    } else {
      const parentFolder = getFolderById(parentId);
      if (parentFolder !== null) parentFolder.children?.push(folder);
    }
  }

  const setFolderTree = (id: number, folder: FolderTree) => {
    const set = (folders: FolderTree[], id: number): boolean => {
      for (let i = 0; i < folders.length; i++) {
        if (folders[i].id == id) {
          folders[i] = folder;
          return true;
        }
        if (set(folders[i].children || [], id)) return true;
      }
      return false;
    }
    set(folderTree.value, id);
  }

  const delFolderTree = (id: number) => {
    const del = (folders: FolderTree[], id: number): boolean => {
      for (let i = 0; i < folders.length; i++) {
        if (folders[i].id == id) {
          folders.splice(i, 1);
          return true;
        }
        if (del(folders[i].children || [], id)) return true;
      }
      return false;
    }
    del(folderTree.value, id);
  }

  return { folderTree, currentFolder, defaultExpandedKeys, getFolderById, addFolderTree, setFolderTree, delFolderTree }
});
