import { createPinia } from 'pinia';
import { useAppStore } from './app';
import { useUserStore } from './user';
import { useDirStore } from './directory';
import { usePathStore } from './path';

const pinia = createPinia();

export { useAppStore, useDirStore, usePathStore, useUserStore };
export default pinia;
