<script setup lang="ts">
import Vditor from 'vditor';
import { MoreFilled } from '@element-plus/icons-vue';
import { useNoteStore } from '@/store';
import { NoteFolderInfo } from '@/types';
import { noteApi } from '@/api';

const noteStore = useNoteStore();

// 笔记节点样式
const customNodeClass = (data: NoteFolderInfo) => {
  let style = 'default';
  // 激活节点
  if (noteStore.currentNote !== null && noteStore.currentNote.id === data.noteId) {
    style += ' active';
    if (noteStore.isAlter) style += ' not-save';
  }
  return style;
}

const onClick = (note: NoteFolderInfo) => {
  // 不能重复点击
  if (noteStore.currentNote !== null && note.noteId === noteStore.currentNote.id) return;

  // 保存当前笔记
  if (noteStore.currentNote !== null && noteStore.isAlter) {
    noteApi.set(noteStore.currentNote.id, { content: noteStore.editor?.getValue() });
  }

  noteApi.get(note.noteId as number).then(res => {
    noteStore.currentNotes = [res.data];
    if (noteStore.editor !== null) {
      (noteStore.editor as Vditor).setValue(res.data.content || '', true);
    }
    noteStore.isAlter = false;
  });
};

const dropdownCommand = (command: {name: string, id: number}) => {
  if (command.name === 'copyLine') {
    console.log(command.id)
  }
};
</script>

<template>
  <el-tree
    class="note-tree"
    :data="noteStore.notes"
    :props="{ label: 'name', class: customNodeClass }"
    node-key="id"
    @node-click="onClick"
  >
    <template #default="{ node, data }">
      <span class="tree-node">
        <span class="el-tree-node__label">{{ data.name }}</span>
        <el-dropdown @command="dropdownCommand">
          <el-icon class="tree-operate"><MoreFilled /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="{name: 'copyLine', id: data.id}">复制链接</el-dropdown-item>
              <el-dropdown-item divided :command="{name: 'update', id: data.id}">重命名</el-dropdown-item>
              <el-dropdown-item :command="{name: 'delete', id: data.id}">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </span>
    </template>
  </el-tree>
</template>

<style scoped>
.tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 24px;
  color: #777;
}

.note-tree >>> .el-tree__empty-block {
  background-color: #fafafa;
}

.note-tree >>> .default {
  border-left: 4px solid #fafafa;
  background-color: #fafafa;
}

.note-tree >>> .active {
  border-left: 4px solid #777;
  background-color: #eee;
}

.note-tree >>> .not-save .el-tree-node__label {
  color: #f75353;
}

.tree-node:hover {
  color: #333;
}

.tree-node:hover .tree-operate {
  display: block;
}

.tree-operate {
  display: none;
  color: #999;
}
</style>
