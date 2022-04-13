import { BaseEntity, Page, UserPage } from '@/types';
import axios from 'axios';

export interface ReplyData {
  commentId?: number;
  toUserId?: number;
  content?: string;
}

export interface ReplyOutline extends BaseEntity {
  user: UserPage;
  atUser: UserPage;
  content: string;
  likeCount: number;
  active: boolean;
}

const replyApi = {

  add (data: ReplyData) {
    return axios.post<ReplyOutline>('/api/reply', data);
  },

  list (commentId: number, page: number = 1, size: number = 10) {
    return axios.get<Page<ReplyOutline>>(`/api/reply`, { params: { commentId, page, size }});
  },

  del (id: number) {
    return axios.delete(`/api/reply/${id}`);
  }

}

export default replyApi;
