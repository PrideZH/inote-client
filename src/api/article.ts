import { ArticlePage, ArticleOpen, Page, ArticleInfo } from '@/types';
import axios from 'axios';

export interface ArtivleData {
  coverUrl?: string;
  noteId?: number;
  status?: number;
  summary?: string;
  tags?: string[];
  title?: string;
}

const articleApi = {

  add (data: ArtivleData) {
    return axios.post<ArticleInfo>('/api/article', data);
  },

  get (id: number) {
    return axios.get<ArticleOpen>(`/api/article/${id}`);
  },

  getContent (id: number, section?: string) {
    return axios.get<string>(`/api/article/${id}/content`, { params: { section } });
  },

  getMe (id: number) {
    return axios.get<ArticleInfo>(`/api/article/${id}/me`);
  },

  getList (page: number = 1, size: number = 10, keywords?: string[], userId?: number) {
    return axios.get<Page<ArticlePage>>('/api/article', { params: { page, size, userId, keywords } });
  },

  getListMe (page: number, size: number) {
    return axios.get<Page<ArticlePage>>('/api/article/me', { params: { page, size } });
  },

  set (id: number, data: ArtivleData) {
    return axios.patch<ArticleInfo>(`/api/article/${id}`, data);
  }

};

export default articleApi;
