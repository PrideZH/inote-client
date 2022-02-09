<script setup lang="ts">
import { noteApi } from '@/api';
import { useNoteStore } from '@/store';
import Vditor from 'vditor';
import { onMounted, nextTick } from 'vue';
import Header from './components/Header.vue';

const noteStore = useNoteStore();

const onSave = () => {
  if (noteStore.currentNote === null) return;
  noteApi.set(noteStore.currentNote.id, { content: noteStore.editor?.getValue() }).then(res => {
    noteStore.currentNotes[noteStore.currentNotes.length - 1] = res.data;
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
    input: () => noteStore.inputCallback(),
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
    <div v-show="noteStore.currentNote !== null" id="editor" @keydown.ctrl.s.prevent="onSave" />
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
