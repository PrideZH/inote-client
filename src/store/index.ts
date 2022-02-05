import { createPinia } from 'pinia';
import { useAppStore } from './modules/app';
import { useFolderStore } from './modules/folder';
import { useNoteStore } from './modules/note';

const pinia = createPinia();

export { useAppStore, useFolderStore, useNoteStore };
export default pinia;
