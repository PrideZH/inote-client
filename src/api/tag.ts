import { Page, TagPage } from '@/types';
import axios from 'axios';

const tagApi = {

  getList(size: number, page: number) {
    return axios.get<Page<TagPage>>('/api/tag', { params: {size, page} });
  }

}

export default tagApi;
