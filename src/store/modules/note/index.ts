import { FolderTree, NoteFolderInfo } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { NoteState } from './types';

export const useNoteStore = defineStore('note', (): NoteState => {
  const notes = ref<NoteFolderInfo[]>([]);

  const __generateNotes = (folder: FolderTree) => {
    folder.notes?.forEach(note => notes.value.push(note));
    folder.children?.forEach(child => __generateNotes(child));
  };

  const showNotes = (folder: FolderTree) => {
    notes.value.splice(0, notes.value.length);
    __generateNotes(folder);
  }

  return { notes, showNotes }
});
