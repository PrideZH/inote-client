import Vditor from 'vditor';
import { Note, NoteFolderInfo } from '@/types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { folderApi } from '@/api';
import { useFolderStore } from '.';

export const useNoteStore = defineStore('note', () => {
  const notes = ref<NoteFolderInfo[]>([]);
  const currentNotes = ref<Note[]>([]);
  const currentNote = computed(() => {
    return currentNotes.value.length === 0 ? null : currentNotes.value[currentNotes.value.length - 1];
  });
  const editor = ref<Vditor | null>(null);
  const isAlter: boolean = false;

  const refresh = () => {
    const folderStore = useFolderStore();
    if (folderStore.currentFolder !== null) {
      folderApi.getRelevance(folderStore.currentFolder.id).then(res => notes.value = res.data);
    }
  };
  refresh();

  const show = (folderId: number) => {
    folderApi.getRelevance(folderId).then(res => notes.value = res.data);
  };

  return { editor, notes, currentNotes, currentNote, isAlter, show, refresh };
});
