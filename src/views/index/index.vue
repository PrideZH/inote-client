<script setup lang="ts">
import { useAppStore, useNoteStore } from '@/store';
import Vditor from 'vditor';
import { onMounted } from 'vue';
import { NotePage } from '@/types';

import Header from './components/Header.vue';
import Directory from './components/Directory.vue';

const appStore = useAppStore();
const noteStore = useNoteStore();

// 异步获取补齐文件跳转链接
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
      position: 'right'
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
  <div class="note-aside" v-show="!appStore.fullscreen">
    <Directory />
    <div class="note-tool">

    </div>
  </div>
  <div class="note-container">
    <Header class="header" />
    <div class="note-main">
      <div v-show="noteStore.currentNote !== null" id="editor" @keydown.ctrl.s.prevent="noteStore.saveCurrentNote()" />
      <div class="note-detail" v-show="!appStore.fullscreen && noteStore.currentNote !== null">
        <el-collapse accordion>
          <el-collapse-item v-if="noteStore.currentNote !== null" title="笔记信息" name="info">
            <div class="info">
              <div>笔记ID</div>
              <div>{{ noteStore.currentNote.name }}_inote_{{ noteStore.currentNote.id }}</div>
              <div>文章</div>
              <div>未上传</div>
              <div>编辑时间</div>
              <div>{{ noteStore.currentNote.createTime }}</div>
              <div>修改时间</div>
              <div>{{ noteStore.currentNote.updateTime }}</div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="笔记大纲" name="outline">
            <div id="outline" />
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<style>
.vditor-toolbar {
  display: none;
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
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  height: 40px;
  border-bottom: 2px solid #ece7ed;
  box-sizing: border-box;
}

.note-main {
  display: flex;
}

.note-detail {
  width: 200px;
  background-color: #fafafa;
}

.note-detail >>> .el-collapse-item__header {
  height: 22px;
  line-height: 22px;
  font-weight: 700;
  background-color: #fafafa;
}

.note-detail >>> .el-collapse-item__content {
  padding-bottom: 0;
  height: calc(100vh - 89px);
}

.info {
  height: 99%;
  padding: 4px 8px;
  background-color: #fafafa;
}

#outline {
  height: 99%;
  overflow: hidden;
  background-color: #fafafa;
}

#outline:hover {
  overflow: scroll;
}

#editor {
  flex: 1;
  border: none;
  height: calc(100vh - 40px);
}

#editor >>> .vditor-reset {
  padding: 12px 64px !important;
}

.note-aside {
  display: flex;
  flex-direction: column;
  width: 180px;
  background-color: #fafafa;
}

.note-tool {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #eee;
}
</style>
