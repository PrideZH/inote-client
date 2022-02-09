import { FolderTree, Note, NoteFolderInfo } from '@/types';
import { defineStore } from 'pinia';
import Vditor from 'vditor';
import { ref } from 'vue';
import { useFolderStore } from '@/store/folder';
import { NoteState } from './types';

export const useNoteStore = defineStore('note', (): NoteState => {
  const notes = ref<NoteFolderInfo[]>([]);
  const currentNote = ref<Note[]>([]);
  const isAlter: boolean = false;
  const editor: Vditor | null = null;

  const __generateNotes = (folder: FolderTree) => {
    folder.notes?.forEach(note => notes.value.push(note));
    folder.children?.forEach(child => __generateNotes(child));
  };

  const showNotes = (folder: FolderTree) => {
    notes.value.splice(0, notes.value.length);
    __generateNotes(folder);
  }

  const addNote = (note: NoteFolderInfo, folderId: number) => {
    const folderStore = useFolderStore();
    const add = (folders: FolderTree[]): boolean => {
      for (let i = 0; i < folders.length; i++) {
        if (folders[i].id === folderId) {
          folders[i].notes?.push(note);
          return true;
        }
        if (add(folders[i].children || [])) return true;
      }
      return false;
    };
    add(folderStore.folderTree);
    notes.value.push(note);
  };

  return { editor, notes, currentNote, isAlter, showNotes, addNote }
});
