<script setup lang="ts">
import { setNote } from '@/api/note';
import { useNoteStore } from '@/store';
import Vditor from 'vditor';
import { onMounted } from 'vue';
import Header from './components/Header.vue';

const noteStore = useNoteStore();

const onSave = () => {
  if (noteStore.currentNote.length === 0) return;
  setNote(noteStore.currentNote[noteStore.currentNote.length - 1].id as number,
      { content: noteStore.editor?.getValue() }).then(res => {
    noteStore.currentNote[noteStore.currentNote.length - 1] = res.data;
    noteStore.isAlter = false;
  });
};

onMounted(() => {
  noteStore.editor = new Vditor('editor', {
    height: window.innerHeight - 40,
    cache: {
      enable: false // 关闭缓存
    },
    outline: {
      enable: true,
      position: 'left'
    },
    input: () => {
      noteStore.isAlter = true;
    },
    after: () => {
      // 设置大纲到侧边栏下
      document.getElementById('outline')?.append(document.getElementsByClassName('vditor-outline')[0]);
    }
  });
});
</script>

<template>
  <div class="note-container">
    <Header class="header" />
    <div v-show="noteStore.currentNote.length !== 0" id="editor" @keydown.ctrl.s.prevent="onSave" />
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
</style>
