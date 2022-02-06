import axios from 'axios';
import { NoteFolderInfo, Note } from '@/types';

export interface NoteData {
  name?: string;
  folderId?: number;
  content?: string;
}

export function addNote(noteData: NoteData) {
  return axios.post<NoteFolderInfo>('/api/note/me', noteData);
}

export function getNote(id: number) {
  return axios.get<Note>(`/api/note/${id}`);
}

export function getNotRelevance() {
  return axios.get<NoteFolderInfo[]>(`/api/note/notRelevance`);
}

export function setNote(id: number, noteData: NoteData) {
  return axios.patch<Note>(`/api/note/${id}`, noteData);
}

export function delNote(id: number) {
  return axios.delete(`/api/note/${id}`);
}
