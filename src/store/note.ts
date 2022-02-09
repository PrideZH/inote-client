import Vditor from 'vditor';
import { Note, NoteFolderInfo } from '@/types';
import { defineStore } from 'pinia';
import { computed, nextTick, ref } from 'vue';
import { folderApi, noteApi } from '@/api';
import { useFolderStore } from '.';

export const useNoteStore = defineStore('note', () => {
  const notes = ref<NoteFolderInfo[]>([]);
  const currentNotes = ref<Note[]>([]);
  const currentNote = computed(() => {
    return currentNotes.value.length === 0 ? null : currentNotes.value[currentNotes.value.length - 1];
  });
  const editor = ref<Vditor | null>(null);
  const isAlter = ref<boolean>(false);

  const refresh = () => {
    const folderStore = useFolderStore();
    if (folderStore.currentFolder !== null) {
      folderApi.getRelevance(folderStore.currentFolder.id).then(res => notes.value = res.data);
    }
  };
  refresh();

  // 获取指定文件夹下的所有笔记 0-未分类文件夹
  const show = (folderId: number) => {
    folderApi.getRelevance(folderId).then(res => notes.value = res.data);
  };

  // 链接点击事件
  const linkClickEvent = (e: Event) => {
    let ele: Element = e.target as Element;
    // 链接不在编辑状态下
    if (!(ele.parentNode as Element).classList.contains('vditor-ir__node--expand')) {
      const link: string = ele.nextElementSibling?.nextElementSibling?.nextElementSibling?.innerHTML as string;
      const host: string = window.location.host;
      if (link.indexOf(host) !== 0) {
        const pathAndParm: string[] = link.substring(link.indexOf(host) + host.length).split('?');
        if (pathAndParm[1] === undefined) {
          return;
        }
        const parms: string[] = pathAndParm[1].split('=');
        if (parms[0] !== 'n') {
          return;
        }
        const id = parms[1];
        if (pathAndParm[0] === '/index') { // 跳转工作区笔记
          noteApi.get(Number(id)).then(res => {
            push(res.data);
          });
          e.stopPropagation();
        } else if (pathAndParm[1] === '/article') { // 跳转文章
          e.stopPropagation();
        }
      }
    }
  };
  const __renderVditorLink = () => {
    const linkElements: any = document.getElementsByClassName('vditor-ir__link');
    for (let i = 0; i < linkElements.length; i++) {
      const linkElement: HTMLElement = linkElements[i];
      linkElement.onclick = linkClickEvent;
    }
  };

  // 打开笔记 isCover-是否覆盖当前所有以打开笔记
  const push = (note: Note, isCover: boolean = false) => {
    // 保存当前笔记
    if (currentNote.value !== null && isAlter.value) {
      noteApi.set(currentNote.value.id, { content: editor.value?.getValue() });
    }

    if (isCover) {
      currentNotes.value = [ note ];
    } else {
      for (let i = 0; i < currentNotes.value.length; i++) {
        if (currentNotes.value[i].id === note.id) {
          currentNotes.value.splice(i, currentNotes.value.length - i);
          break;
        }
      }
      currentNotes.value.push(note);
    }
    if (editor.value !== null) {
      editor.value.setValue(note.content, true);
    }
    isAlter.value = false;
    // 添加链接点击事件
    nextTick(() => __renderVditorLink());
  };

  const inputCallback = () => {
    isAlter.value = true;

    __renderVditorLink();
  }

  return {
    editor,
    notes,
    currentNotes,
    currentNote,
    isAlter,
    show,
    refresh,
    push,
    inputCallback
  };
});
