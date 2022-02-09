import { ArticlePage, Page } from '@/types';
import axios from 'axios';

const articleApi = {
  getList (page: number = 1, size: number = 10, keywords?: string[]) {
    return axios.get<Page<ArticlePage>>('/api/article', { params: { page, size, keywords } });
  }
};

export default articleApi;
