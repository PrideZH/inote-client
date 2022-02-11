import axios from 'axios';
import { NoteFolderInfo, Note, NotePage, Page } from '@/types';

export interface NoteData {
  name?: string;
  folderId?: number;
  content?: string;
}

const noteApi = {

  add (noteData: NoteData) {
    return axios.post<NoteFolderInfo>('/api/note/me', noteData);
  },

  get (id: number) {
    return axios.get<Note>(`/api/note/${id}`);
  },

  getList(size: number, page: number, keyword?: string) {
    return axios.get<Page<NotePage>>('/api/note', { params: {size, page, keyword} });
  },

  set (id: number, noteData: NoteData) {
    return axios.patch<Note>(`/api/note/${id}`, noteData);
  },

  delNote (id: number) {
    return axios.delete(`/api/note/${id}`);
  }

};

export default noteApi;
