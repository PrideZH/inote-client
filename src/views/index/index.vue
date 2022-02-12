<script setup lang="ts">
import { noteApi } from '@/api';
import { useNoteStore } from '@/store';
import { NotePage } from '@/types';
import Vditor from 'vditor';
import { onMounted } from 'vue';
import Header from './components/Header.vue';

const noteStore = useNoteStore();

const getNoteLinks = (query: string) => {
  let result: {value: string, html: string}[] = [];
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4 || xhr.status !== 200) {
      return;
    }
    const res = JSON.parse(xhr.responseText);
    result = res.data.records.map((note: NotePage) => ({
      html: `${note.name} - inote_${note.id}`, value: `[${note.name}](http://localhost:3001/index?n=${note.id})\xa0`
    }));
  };
  xhr.open('get', `/api/note?size=100&page=1&keyword=${query}`, false);
  xhr.send(null);
  return result;
}

onMounted(() => {
  noteStore.editor = new Vditor('editor', {
    height: '100%',
    cache: {
      enable: false // 关闭缓存
    },
    outline: {
      enable: true,
      position: 'left'
    },
    input: () => noteStore.inputCallback(),
    after: () => {
      // 设置大纲到侧边栏下
      document.getElementById('outline')?.append(document.getElementsByClassName('vditor-outline')[0]);
    },
    hint: {
      extend: [
        {
          key: '@',
          hint: (key) => {
            if (key === '') return [];
            return getNoteLinks(key);
          },
        }
      ]
    }
  });
});
</script>

<template>
  <div class="note-container">
    <Header class="header" />
    <div v-show="noteStore.currentNote !== null" id="editor" @keydown.ctrl.s.prevent="noteStore.saveCurrentNote()" />
  </div>
</template>

<style>
.vditor-toolbar {
  display: none;
}

.vditor-outline {
  width: 100%;
}

.vditor-outline .vditor-outline__title{
  display: none;
}

.vditor-outline li>span:hover {
    color: #4285f4;
}

.vditor-outline svg {
  margin-right: 5px;
}

.vditor-outline li {
  font-size: var(--el-font-size-base);
}
</style>
<style scoped>
.note-container {
  display: flex;
  flex-direction: column;
}

.header {
  height: 40px;
  border-bottom: 2px solid #ece7ed;
  box-sizing: border-box;
}

#editor {
  border: none;
  height: calc(100% - 40px);
}

#editor >>> .vditor-reset {
  padding: 12px 64px !important;
}
</style>
