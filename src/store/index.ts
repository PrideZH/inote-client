import { createPinia } from 'pinia';
import { useAppStore } from './modules/app';
import { useUserStore } from './user';
import { useFolderStore } from './folder';
import { useNoteStore } from './modules/note';

const pinia = createPinia();

export { useAppStore, useUserStore, useFolderStore, useNoteStore };
export default pinia;
