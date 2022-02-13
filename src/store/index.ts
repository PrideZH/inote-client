import { createPinia } from 'pinia';
import { useAppStore } from './app';
import { useUserStore } from './user';
import { useDirStore } from './directory';
import { useNoteStore } from './note';

const pinia = createPinia();

export { useAppStore, useDirStore, useNoteStore, useUserStore };
export default pinia;
