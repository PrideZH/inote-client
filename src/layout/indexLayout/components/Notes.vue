<script setup lang="ts">
import { MoreFilled } from '@element-plus/icons-vue';
import { useNoteStore } from '@/store';
import { NoteFolderInfo } from '@/types';
import { getNote } from '@/api/note';

const noteStore = useNoteStore();

const customNodeClass = (data: NoteFolderInfo) => {
  let style = 'default';
  if (noteStore.currentNote.length !== 0 && noteStore.currentNote[0].id === data.noteId) {
    style += ' active';
    if (noteStore.isAlter) style += ' not-save';
  }
  return style;
}

const onClick = (note: NoteFolderInfo) => {
  // 不能重复点击
  if (noteStore.currentNote.length !== 0 && note.noteId === noteStore.currentNote[0].id) return;

  getNote(note.noteId as number).then(res => {
    noteStore.currentNote = [res.data];
    noteStore.editor?.setValue(res.data.content || '', true);
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
