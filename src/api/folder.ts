import axios from 'axios';
import { FolderTree, NoteFolderInfo } from '@/types';

export interface FolderData {
  name?: string;
  parentId?: number;
}

export interface RelevanceData {
  name: string;
  noteId: number;
  folderId: number;
}

export function addFolder(folderData: FolderData) {
  return axios.post<FolderTree>('/api/folder/me', folderData);
}

/**
 * 添加笔记与文件夹的关联
 */
export function addRelevance(relevanceData: RelevanceData) {
  return axios.post<NoteFolderInfo>('/api/folder/relevance', relevanceData);
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
