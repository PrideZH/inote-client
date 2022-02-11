import { ArticlePage, ArticleOpen, Page, ArticleInfoPage } from '@/types';
import axios from 'axios';

const articleApi = {

  get (id: number) {
    return axios.get<ArticleOpen>(`/api/article/${id}`);
  },

  getList (page: number = 1, size: number = 10, keywords?: string[]) {
    return axios.get<Page<ArticlePage>>('/api/article', { params: { page, size, keywords } });
  },

  getListMe (page: number, size: number) {
    return axios.get<Page<ArticleInfoPage>>('/api/article/me', { params: { page, size } });
  }

};

export default articleApi;
