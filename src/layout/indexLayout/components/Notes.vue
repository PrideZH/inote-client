<script setup lang="ts">
import { MoreFilled } from '@element-plus/icons-vue';
import { useFolderStore, useNoteStore } from '@/store';
import { NoteFolderInfo } from '@/types';
import { folderApi, noteApi } from '@/api';

const noteStore = useNoteStore();
const folderStore = useFolderStore();

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

  noteApi.get(note.noteId as number).then(res => {
    noteStore.push(res.data, true);
  });
};

const dropdownCommand = (command: {name: string, id: number}) => {
  if (command.name === 'copyLine') {
    console.log(command.id)
  } else if (command.name === 'delete') {
    folderApi.delRelevance(command.id).then(res => {
      noteStore.refresh();
    });
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
      <el-tooltip
        placement="bottom-start"
        effect="light"
        :content="`${folderStore.getPath(data.folderId)}\\${data.name}`"
        :show-after="1000"
        :show-arrow="false"
        :enterable="false"
      >
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
      </el-tooltip>
    </template>
  </el-tree>
</template>

<style scoped>
.tree-node {
  display: flex;
  align-items: center;
  width: 100%;
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

.tree-node >>> .el-dropdown {
  position: absolute;
  right: 16px;
  line-height: 16px;
}

.tree-operate {
  display: none;
  color: #999;
}
</style>
