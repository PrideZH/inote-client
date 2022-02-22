<script setup lang="ts">
import { ref, watch } from 'vue';

import { useDirStore, useNoteStore } from '@/store';

import { DirectoryNode } from '@/types';
import { folderApi, noteApi } from '@/api';

import Node from 'element-plus/es/components/tree/src/model/node';
import IconBtn from '@/components/IconBtn.vue';
import Contextmenu from '@/components/Contextmenu.vue';
import ContextmenuItem from '@/components/ContextmenuItem.vue';
import ContextmenuDivided from '@/components/ContextmenuDivided.vue';
import CreateNoteDialog from './CreateNoteDialog.vue';
import CreateFolderDialog from './CreateFolderDialog.vue';
import AddNoteDialog from './AddNoteDialog.vue';
import RenameDirDialog from './RenameDirDialog.vue';
import { Document, Sort, Refresh } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import useClipboard from 'vue-clipboard3';

const dirStore = useDirStore();
const noteStore = useNoteStore();

const treeRef = ref();
const contextMenuRef = ref();
const createNoteDialogRef = ref();
const createFolderDialogRef = ref();
const addNoteDialogRef = ref();
const renameDirDialogRef = ref();

const dirData = ref<DirectoryNode[]>([]);

// 笔记节点样式
const nodeClass = (data: DirectoryNode) => {
  let style = 'tree-node';
  // 激活
  if (dirStore.activeKey === data.dirId) {
    style += ' tree-node-active'
  }
  if (!data.note) {
    return style;
  }
  // 笔记样式
  style += ' tree-node-note'
  // 选中
  if (noteStore.currentNote !== null && noteStore.currentNote.id === data.noteId) {
    style += ' tree-node-current';
    // 被修改
    if (noteStore.isAlter) {
      style += ' tree-node-alter';
    }
  }

  return style;
}

// 懒加载数据
const loadNode = (node: Node, resolve: (data: DirectoryNode[]) => void) => {
  const directoryNode: DirectoryNode = node.data as DirectoryNode;
  // 获取根路径下文件
  if (node.level === 0) {
    if (dirStore.activeMode === 'directory') {
      folderApi.getDirectory(0).then(res => {
        resolve(res.data);
      });
    } else if (dirStore.activeMode === 'recentness') {
      noteApi.getMeRecentness(7).then(res => {
        resolve(res.data);
      });
    } else if (dirStore.activeMode === 'discrete') {
      noteApi.getMeDiscrete().then(res => {
        resolve(res.data);
      });
    }
  } else {
    folderApi.getDirectory(directoryNode.id).then(res => {
      resolve(res.data);
    });
  }
}

// 文件无法放置在笔记文件下
const isAllowDrop = (
  _draggingNode: Node,
  dropNode: Node,
  dropType: 'inner' | 'prev' | 'next',
): boolean => {
  return !(dropType === 'inner' && dropNode.data.note);
}

// 点击笔记文件获取笔记详细信息
const onClickNode = (node: DirectoryNode) => {
  dirStore.activeKey = node.dirId;
  if (node.note) {
    if (node.noteId === undefined) {
      ElMessage.error({ message: '数据异常', grouping: true });
      return;
    }
    noteApi.get(node.noteId).then(res => {
      // 覆盖当前所有笔记
      noteStore.push(res.data, true);
    });
  }
}

const onContextmenu = (event: MouseEvent, node: DirectoryNode | null) => {
  if (node === null) {
    dirStore.activeKey = '';
  } else {
    dirStore.activeKey = node.dirId;
  }
  contextMenuRef.value.open(event, node);
};

const onDropNode = (
  draggingNode: Node,
  dropNode: Node,
  dropType: 'inner' | 'before' | 'after',
  ev: DragEvent
) => {
  let parentId: number = 0;
  if (dropType === 'inner') {
    parentId = dropNode.data.id;
  } else if (dropType === 'before' || dropType === 'after') {
    parentId = dropNode.parent.data.id || 0;
  }
  if (draggingNode.data.note) {
    folderApi.setRelevance(draggingNode.data.id, { parentId }).then(res => __refresh(parentId));
  } else {
    folderApi.set(draggingNode.data.id, { parentId }).then(res => __refresh(parentId));
  }
}

const onExpand = (node: DirectoryNode) => {
  dirStore.expandedKeys.push(node.dirId);
};

const onCollapse = (node: DirectoryNode) => {
  const index: number = dirStore.expandedKeys.indexOf(node.dirId);
  if (index > -1) dirStore.expandedKeys.splice(index, 1);
};

// 文件夹过滤
const filterText = ref<string>('');
watch(filterText, (val: string) => {
  treeRef.value!.filter(val)
})
const filterNode = (value: string, data: DirectoryNode) => {
  if (!value) return true;
  return data.name?.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1;
}

// 更新指定父文件夹下的文件
const __refresh = (folderId: number) => {
  if (folderId === 0) {
    dirStore.refreshTree();
  } else {
    folderApi.getDirectory(folderId).then(res => {
      treeRef.value.updateKeyChildren('folder_' + folderId, res.data);
    });
  }
}

// 右键菜单功能
const onClickCreateNode = (parentId: number | null) => {
  createNoteDialogRef.value.open(parentId, (data: DirectoryNode) => {
    __refresh(data.parentId);
    // 打开新建笔记
    noteApi.get(data.noteId as number).then(res => {
      noteStore.push(res.data, true);
    });
  });
}
const onClickCreateFolder = (node: DirectoryNode) => {
  createFolderDialogRef.value.open(node !== null ? node.id : 0, (data: DirectoryNode) => {
    __refresh(data.parentId);
  });
}
const onClickAddFolder = (node: DirectoryNode) => {
  addNoteDialogRef.value.open(node.id, (data: DirectoryNode) => {
    __refresh(data.parentId);
  });
}
const { toClipboard } = useClipboard();
const onCopyLink = async (node: DirectoryNode) => {
  try {
    await toClipboard(`[${node.name}](${window.location.host}/link?n=${node.noteId})\xa0`);
    ElMessage.success('复制成功');
  } catch (e) {
    ElMessage.error('复制失败: ' + e)
  }
}
const onClickRename = (node: DirectoryNode) => {
  ElMessageBox.prompt('重命名', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^[^/\\:*?<>|"]{1,255}$/,
    inputErrorMessage: '文件名格式错误',
    inputValue: node.name
  }).then(({ value }) => {
    if (node.note) {
      folderApi.setRelevance(node.id, { name: value }).then(res => {
        __refresh(node.parentId);
      });
    } else {
      folderApi.set(node.id, { name: value }).then(res => {
        __refresh(node.parentId);
      });
    }
  }).catch(() => {});
}
// 删除关联笔记
const onClickDel = (node: DirectoryNode) => {
  if (node.note) {
    folderApi.delRelevance(node.id).then(res => {
      __refresh(node.parentId);
    });
  } else {
    folderApi.del(node.id).then(res => {
      __refresh(node.parentId);
    });
  }
}
// 删除笔记
const onClickDelNode = (node : DirectoryNode) => {
  noteApi.delNote(node.id).then(res => {
    __refresh(node.parentId);
  });
}
</script>

<template>
  <div class="directory-container">

    <div class="dir-tool">
      <el-input v-model="filterText" size="small" />
      <IconBtn><el-icon><Sort /></el-icon></IconBtn>
      <!-- <IconBtn @click="addDialogRef?.open(0)"><el-icon><FolderAdd /></el-icon></IconBtn> -->
      <IconBtn @click="dirStore.refreshTree"><el-icon><Refresh /></el-icon></IconBtn>
    </div>

    <div class="tree-scroll">
      <el-tree
        class="tree"
        ref="treeRef"
        v-if="dirStore.treeRefresh"
        :data="dirData"
        :props="{ label: 'name', isLeaf: 'note', class: nodeClass }"
        :default-expanded-keys="dirStore.expandedKeys"
        :current-node-key="dirStore.activeKey"
        node-key="dirId"
        draggable
        lazy
        :allow-drop="isAllowDrop"
        :load="loadNode"
        :filter-node-method="filterNode"
        @contextmenu.prevent="onContextmenu($event, null)"
        @node-click="onClickNode"
        @node-contextmenu = "onContextmenu"
        @node-drop="onDropNode"
        @node-expand="onExpand"
        @node-collapse="onCollapse"
      >
        <template #default="{ node, data }">
          <div>
            <el-icon class="note-icon" v-if="data.note"><Document /></el-icon>
            <span style="flex: 1">{{ data.name }}</span>
          </div>
        </template>
      </el-tree>
    </div>
  </div>

  <Contextmenu ref="contextMenuRef">
    <template #default="{ data }">
      <template v-if="dirStore.activeMode === 'directory'">
        <!-- 根路径菜单 -->
        <template v-if="data === null">
          <ContextmenuItem @click="onClickCreateNode(0)">新建笔记</ContextmenuItem>
          <ContextmenuItem @click="onClickCreateFolder(data)">新建文件夹</ContextmenuItem>
        </template>
        <!-- 文件菜单 -->
        <template v-else>
          <ContextmenuItem v-if="!data.note" @click="onClickCreateNode(data.id)">新建笔记</ContextmenuItem>
          <ContextmenuItem v-if="!data.note" @click="onClickCreateFolder(data)">新建文件夹</ContextmenuItem>
          <ContextmenuItem v-if="!data.note" @click="onClickAddFolder(data)">添加笔记</ContextmenuItem>
          <ContextmenuDivided v-if="!data.note" />
          <ContextmenuItem v-if="data.note" @click="onCopyLink(data)">复制链接</ContextmenuItem>
          <ContextmenuDivided v-if="data.note" />
          <ContextmenuItem @click="onClickRename(data)">重命名</ContextmenuItem>
          <ContextmenuItem @click="onClickDel(data)">删除</ContextmenuItem>
        </template>
      </template>
      <template v-else-if="dirStore.activeMode === 'discrete'">
        <template v-if="data === null">
          <ContextmenuItem @click="onClickCreateNode(null)">新建笔记</ContextmenuItem>
        </template>
        <template v-else>
          <ContextmenuItem @click="onClickDelNode(data)">删除</ContextmenuItem>
        </template>
      </template>
    </template>
  </Contextmenu>

  <CreateNoteDialog ref="createNoteDialogRef" />
  <CreateFolderDialog ref="createFolderDialogRef" />
  <AddNoteDialog ref="addNoteDialogRef" />
  <RenameDirDialog ref="renameDirDialogRef" />
</template>

<style scoped>
.directory-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
}

.dir-tool {
  display: flex;
  align-items: center;
  padding: 4px 8px;
}

.tree-scroll {
  flex: 1;
  display: flex;
  overflow-x: hidden;
  overflow-y: scroll;
}

.tree-scroll:hover {
  overflow-x: scroll;
}

.tree {
  flex: 1;
  background-color: #fafafa;
}

.tree .note-icon {
  padding: 8px;
}

.tree >>> .tree-node {
  color: #333;
  font-size: 14px;
}

.tree >>> .tree-node-note .el-tree-node__expand-icon {
  display: none;
}

.tree >>> .tree-node-active > .el-tree-node__content {
  background-color: #ecf5ff;
}

.tree >>> .tree-node-current > .el-tree-node__content {
  border-left: 4px solid #777;
  background-color: #eee;
}

.tree >>> .tree-node-current .note-icon {
  padding: 6px 4px;
  margin-right: 4px;
}

.tree >>> .tree-node-alter {
  color: #f75353;
}
</style>
