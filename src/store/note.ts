import Vditor from 'vditor';
import { Note } from '@/types';
import { defineStore } from 'pinia';
import { computed, nextTick, ref } from 'vue';
import { noteApi } from '@/api';

// 保存笔记相关信息
export const useNoteStore = defineStore('note', () => {

  // 当前打开的所有笔记
  const currentNotes = ref<Note[]>([]);
  // 正在浏览的笔记 即最后一个笔记
  const currentNote = computed(() => {
    return currentNotes.value.length === 0 ? null : currentNotes.value[currentNotes.value.length - 1];
  });
  // 编辑器
  const editor = ref<Vditor | null>(null);
  // 是否被修改
  const isAlter = ref<boolean>(false);


  // 保存当前笔记
  const saveCurrentNote = () => {
    if (currentNote.value !== null && isAlter.value) {
      const current = currentNotes.value[currentNotes.value.length - 1];
      current.content = editor.value?.getValue() as string;
      noteApi.set(current.id, { content: editor.value?.getValue() }).then(res => {
        current.updateTime === res.data.updateTime;
        isAlter.value = false;
      });
    }
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
  // 渲染笔记跳转链接
  const __renderVditorLink = () => {
    const linkElements: any = document.getElementsByClassName('vditor-ir__link');
    for (let i = 0; i < linkElements.length; i++) {
      const linkElement: HTMLElement = linkElements[i];
      linkElement.onclick = linkClickEvent;
    }
  };

  // 打开笔记 isCover-是否覆盖当前所有以打开笔记
  const push = (note: Note, isCover: boolean = false) => {
    saveCurrentNote();

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
  }

  // 输入回调
  const inputCallback = () => {
    isAlter.value = true;

    __renderVditorLink();
  }

  return { currentNotes, currentNote, editor, isAlter, saveCurrentNote, push, inputCallback }
});
