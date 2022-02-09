<script setup lang="ts">
import { noteApi } from '@/api';
import { useNoteStore } from '@/store';
import Vditor from 'vditor';
import { onMounted } from 'vue';
import Header from './components/Header.vue';

const noteStore = useNoteStore();

onMounted(() => {
  // 关键字补齐(hint)暂不支持异步 [#1097](https://github.com/Vanessa219/vditor/pull/1097)
  let keyworks: {value: string, html: string}[] = [];
  noteApi.getList().then(res => {
    keyworks = res.data.map(note => ({
      html: note.name, value: `[${note.name}](http://localhost:3001/index?n=${note.id})`
    }));
  });

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
    },
    hint: {
      extend: [
        {
          key: '@',
          hint: (key) => {
            if (key === '') return [];
            key = key.toLocaleLowerCase();
            return keyworks.filter(keywork => keywork.html.toLocaleLowerCase().indexOf(key) === 0);
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
</style>
