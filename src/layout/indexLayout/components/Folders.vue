<script setup lang="ts">
import IconBtn from '@/components/IconBtn.vue';
import { useFolderStore, useNoteStore } from '@/store';
import { FolderTree } from '@/types';
import { FolderAdd, Sort, MoreFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { ref, watch } from 'vue';
import RenameDialog from './FolderRenameDialog.vue';
import AddDialog from './FolderAddDialog.vue';
import Node from 'element-plus/es/components/tree/src/model/node';
import { folderApi, noteApi } from '@/api';

const folderStore = useFolderStore();
const noteStore = useNoteStore();

const renameDialogRef = ref<InstanceType<typeof RenameDialog>>();
const addDialogRef = ref<InstanceType<typeof AddDialog>>();

let clickCut: number = 0, clickKey: number = 0, timer: any = null;
// 双击触发
const onClick = (folder: FolderTree) => {
  if (folder.id === clickKey) {
    clickCut++;
  } else {
    clickKey = folder.id as number;
    clickCut = 1;
  }
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
  timer = setTimeout(() => clickCut = 0, 500);
  if (clickCut === 2) {
    // 获取文件夹笔记
    folderStore.currentFolder = folder;
    noteStore.show(folder.id);
    clickCut = 0;
  }
};

const onExpand = (folder: FolderTree) => {
  folderStore.defaultExpandedKeys.push(folder.id as number);
};

const onCollapse = (folder: FolderTree) => {
  const index: number = folderStore.defaultExpandedKeys.indexOf(folder.id as number);
  if (index > -1) folderStore.defaultExpandedKeys.splice(index, 1);
};

const onDrop = (
  draggingNode: Node,
  dropNode: Node,
  dropType: 'inner' | 'before' | 'after',
  ev: DragEvent
) => {
  if (dropType === 'inner') {
    const parentId = dropNode.data.id;
    folderApi.set(draggingNode.data.id, {parentId}).then(res => folderStore.refresh());
  } else if (dropType === 'before' || dropType === 'after') {
    const parent: FolderTree | null = folderStore.getParent(dropNode.data.id);
    const parentId = parent ? parent.id : 0;
    folderApi.set(draggingNode.data.id, {parentId}).then(res => folderStore.refresh());
  }
};

// 文件夹过滤
const treeRef = ref();
const filterText = ref<string>('');
watch(filterText, (val: string) => {
  treeRef.value!.filter(val)
})
const filterNode = (value: string, data: FolderTree) => {
  if (!value) return true;
  return data.name?.indexOf(value) !== -1;
}

const dropdownCommand = (command: {name: string, id: number}) => {
  if (command.name === 'add') {
    addDialogRef.value?.open(command.id);
  } else if (command.name === 'update') {
    renameDialogRef.value?.open(command.id);
  } else if (command.name === 'delete') {
    folderApi.del(command.id).then(res => {
      ElMessage.success('删除成功');
      folderStore.refresh();
    });
  }
};
</script>

<template>
  <div class="folder-tool">
    <el-input v-model="filterText" size="small" />
    <IconBtn><el-icon><Sort /></el-icon></IconBtn>
    <IconBtn @click="addDialogRef?.open(0)"><el-icon><FolderAdd /></el-icon></IconBtn>
  </div>

  <el-tree :data="[{id: 0, label: '未分类'}]" @node-click="onClick" />
  <el-tree
    ref="treeRef"
    :data="folderStore.folderTree"
    :props="{label: 'name'}"
    node-key="id"
    :default-expanded-keys="folderStore.defaultExpandedKeys"
    :filter-node-method="filterNode"
    draggable
    @node-click="onClick"
    @node-expand="onExpand"
    @node-collapse="onCollapse"
    @node-drop="onDrop"
  >
    <template #default="{ node, data }">
      <span class="tree-node">
        <span class="el-tree-node__label">{{ data.name }}</span>
        <el-dropdown @command="dropdownCommand">
          <el-icon class="tree-operate"><MoreFilled /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="{name: 'add', id: data.id}">新建文件夹</el-dropdown-item>
              <el-dropdown-item divided :command="{name: 'update', id: data.id}">重命名</el-dropdown-item>
              <el-dropdown-item :command="{name: 'delete', id: data.id}">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </span>
    </template>
  </el-tree>

  <AddDialog ref="addDialogRef" />

  <RenameDialog ref="renameDialogRef" />
</template>

<style scoped>
.folder-tool {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 16px;
  margin-bottom: 4px;
}

.tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 24px;
}

.tree-node:hover .tree-operate {
  display: block;
}

.tree-operate {
  display: none;
  color: #999;
}
</style>
