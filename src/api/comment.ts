import { BaseEntity, Page, UserPage } from '@/types';
import axios from 'axios';
import { ReplyOutline } from './reply';

export interface CommentData {
  articleId?: number;
  content?: string;
}

export interface CommentOutline extends BaseEntity {
  user: UserPage;
  content: string;
  likeCount: number;
  active: boolean;
  page: number;
  replyPage: Page<ReplyOutline>;
}

const commentApi = {

  add (data: CommentData) {
    return axios.post<CommentOutline>('/api/comment', data);
  },

  list (articleId: number, sort: string = 'HOT', page: number = 1, size: number = 10) {
    return axios.get<Page<CommentOutline>>(`/api/comment`, { params: { articleId, sort, page, size }});
  },

  del (id: number) {
    return axios.delete(`/api/comment/${id}`);
  }

}

export default commentApi;
