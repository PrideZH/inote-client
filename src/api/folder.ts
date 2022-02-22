import { DirectoryNode } from '@/types';
import axios from 'axios';

export interface DirectoryData {
  name?: string;
  parentId?: number;
}

export interface RelevanceData {
  name: string;
  noteId: number;
  folderId: number;
}

const folderApi = {

  add (folderData: DirectoryData) {
    return axios.post<DirectoryNode>('/api/folder/me', folderData);
  },

  /**
   * 添加笔记与文件夹的关联
   */
  addRelevance (relevanceData: RelevanceData) {
    return axios.post<DirectoryNode>('/api/folder/relevance', relevanceData);
  },

  getDirectory (id: number) {
    return axios.get<DirectoryNode[]>(`/api/folder/${id}/me/directory`);
  },

  set (id: number, dirData: DirectoryData) {
    return axios.patch<DirectoryNode>(`/api/folder/${id}`, dirData);
  },

  // 修改关联笔记文件
  setRelevance (id: number, dirData: DirectoryData) {
    return axios.patch<DirectoryNode>(`/api/folder/relevance/${id}`, dirData);
  },

  del (id: number) {
    return axios.delete(`/api/folder/${id}`);
  },

  delRelevance (id: number) {
    return axios.delete(`/api/folder/relevance/${id}`);
  }

}

export default folderApi;
