import { createPinia } from 'pinia';
import { useAppStore } from './modules/app';
import { useUserStore } from './modules/user';
import { useFolderStore } from './modules/folder';
import { useNoteStore } from './modules/note';

const pinia = createPinia();

export { useAppStore, useUserStore, useFolderStore, useNoteStore };
export default pinia;
