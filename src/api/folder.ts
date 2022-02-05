import axios from 'axios';
import { FolderTree } from '@/types';

export interface FolderData {
  name?: string;
  parentId?: number;
}

export function addFolder(folderData: FolderData) {
  return axios.post<FolderTree>('/api/folder/me', folderData);
}

export function getFolderTree() {
  return axios.get<FolderTree[]>('/api/folder/me/tree');
}

export function setFolder(id: number, folderData: FolderData) {
  return axios.patch<FolderTree>(`/api/folder/${id}`, folderData);
}

export function delFolder(id: number) {
  return axios.delete(`/api/folder/${id}`);
}
