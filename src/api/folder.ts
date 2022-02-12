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

const folderApi = {

  add (folderData: FolderData) {
    return axios.post<FolderTree>('/api/folder/me', folderData);
  },

  /**
   * 添加笔记与文件夹的关联
   */
  addRelevance (relevanceData: RelevanceData) {
    return axios.post<NoteFolderInfo>('/api/folder/relevance', relevanceData);
  },

  getFolderTree () {
    return axios.get<FolderTree[]>('/api/folder/me/tree');
  },

  getRelevance (id: number) {
    return axios.get<NoteFolderInfo[]>(`/api/folder/${id}/relevance`);
  },

  set (id: number, folderData: FolderData) {
    return axios.patch<FolderTree>(`/api/folder/${id}`, folderData);
  },

  del (id: number) {
    return axios.delete(`/api/folder/${id}`);
  },

  delRelevance (id: number) {
    return axios.delete(`/api/folder/relevance/${id}`);
  }

}

export default folderApi;
