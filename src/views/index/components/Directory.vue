<script setup lang="ts">
import { ref, watch } from 'vue';

import { useDirStore, usePathStore } from '@/store';

import { DirectoryNode } from '@/types';
import { folderApi, noteApi } from '@/api';

import Node from 'element-plus/es/components/tree/src/model/node';
import IconBtn from '@/components/IconBtn.vue';
import Contextmenu from '@/components/Contextmenu.vue';
import ContextmenuItem from '@/components/ContextmenuItem.vue';
import ContextmenuDivided from '@/components/ContextmenuDivided.vue';
import { Document, Sort, Refresh } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import useClipboard from 'vue-clipboard3';
import { useRoute } from 'vue-router';

const emits = defineEmits(['click-leaf']);

const route = useRoute();

const dirStore = useDirStore();
const pathStore = usePathStore();

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
  if (pathStore.pathItem && pathStore.pathItem.id === data.noteId) {
    style += ' tree-node-current';
    // 被修改
    if (pathStore.isAlter) {
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
    if (dirStore.activeMode === 'directory') { // 加载云文件笔记
      folderApi.getDirectory(0).then(res => {
        resolve(res.data);
      });
    } else if (dirStore.activeMode === 'recentness') { // 加载最近编辑笔记
      noteApi.getMeRecentness(7).then(res => {
        resolve(res.data);
      });
    } else if (dirStore.activeMode === 'discrete') { // 加载未关联笔记
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

// 点击笔记文件
const onClickNode = (node: DirectoryNode) => {
  dirStore.activeKey = node.dirId;
  if (node.note) {
    if (node.noteId === undefined) {
      ElMessage.error({ message: '数据异常', grouping: true });
      return;
    }
    pathStore.openItem('note', node.noteId);
  } else {
    pathStore.openItem('folder', node.id);
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
    folderApi.setRelevance(draggingNode.data.id, { folderId: parentId }).then(res => __refresh(parentId));
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
const { toClipboard } = useClipboard();
const onCopyLink = async (node: DirectoryNode) => {
  try {
    await toClipboard(`[${node.name}](${window.location.host}/link?n=${node.noteId})\xa0`);
    ElMessage.success('复制成功');
  } catch (e) {
    ElMessage.error('复制失败: ' + e)
  }
}
// const onClickRename = (node: DirectoryNode) => {
//   ElMessageBox.prompt('重命名', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
//     inputPattern: /^[^/\\:*?<>|"]{1,255}$/,
//     inputErrorMessage: '文件名格式错误',
//     inputValue: node.name
//   }).then(({ value }) => {
//     if (node.note) {
//       noteApi.set(node.id, { name: value }).then(res => {
//         __refresh(node.parentId);
//       });
//     } else {
//       folderApi.set(node.id, { name: value }).then(res => {
//         __refresh(node.parentId);
//       });
//     }
//   }).catch(() => {});
// }
// 删除目录文件
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
const onClickDelNote = (node : DirectoryNode) => {
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
        :expand-on-click-node="false"
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
            <el-icon class="note-icon" v-if="data.note">
              <Document v-if="data.status === null" />
              <svg v-else-if="data.status === 1" t="1649251254307" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3623" width="200" height="200"><path d="M487.424 974.848c-8.704 0-17.408-2.048-25.6-6.656C358.4 912.384 232.448 899.072 87.04 883.2l-13.312-1.536c-33.28-3.072-58.368-30.72-58.368-64.512V276.48c0-35.328 29.184-65.024 65.024-66.048 163.84-2.56 306.688 26.624 424.448 87.552 21.504 10.752 35.328 33.792 35.328 57.856V921.6c0 18.944-9.728 36.352-26.112 46.08-8.192 4.608-17.408 7.168-26.624 7.168zM100.864 261.632h-19.456c-8.192 0-14.848 6.656-14.848 14.848v540.672c0 7.168 5.632 13.312 12.8 13.824l13.312 1.536c151.04 15.872 281.088 30.208 393.728 90.624h0.512c0.512 0.512 1.024 0.512 1.536 0 0.512-0.512 1.024-1.024 1.024-1.536V355.84c0-5.12-3.072-10.24-7.168-12.288-106.496-54.784-234.496-81.92-381.44-81.92z" p-id="3624"></path><path d="M544.256 973.312c-9.728 0-19.456-2.56-28.16-8.192-16.896-10.24-27.136-28.16-26.624-48.128V355.328c0-24.576 13.824-47.616 35.84-58.368 117.76-60.416 260.608-90.112 423.936-87.04 35.84 1.024 65.024 30.208 65.024 66.048v540.672c0 33.792-25.088 61.44-58.88 65.024l-20.992 2.56c-141.312 15.36-263.168 29.184-364.032 82.944-8.192 4.096-17.408 6.144-26.112 6.144zM928.768 261.12c-146.432 0-274.432 27.648-380.416 81.92-4.608 2.56-7.68 7.168-7.68 12.8v562.688c0 1.536 0.512 2.56 2.048 3.584 1.536 1.024 2.56 0.512 3.072 0h0.512c109.568-58.368 236.032-72.192 382.976-88.576l20.992-2.56c7.68-0.512 13.312-6.656 13.312-13.824V275.968c0-8.192-6.656-14.848-14.848-14.848h-19.968z" p-id="3625"></path><path d="M386.56 502.272c-3.072 0-6.656-0.512-9.728-2.048-67.584-27.136-136.704-40.96-204.288-40.96-14.336 0-25.6-11.264-25.6-25.6s11.264-25.6 25.6-25.6c74.24 0 149.504 14.848 223.744 45.056 13.312 5.12 19.456 19.968 14.336 33.28-4.096 9.728-13.824 15.872-24.064 15.872zM386.56 673.792c-3.072 0-6.656-0.512-9.728-2.048-67.584-27.136-136.704-40.96-204.288-40.96-14.336 0-25.6-11.264-25.6-25.6s11.264-25.6 25.6-25.6c74.24 0 149.504 14.848 223.744 45.056 13.312 5.12 19.456 19.968 14.336 33.28-4.096 9.728-13.824 15.872-24.064 15.872zM643.072 502.272c-10.24 0-19.968-6.144-23.552-15.872-5.12-13.312 1.024-28.16 14.336-33.28 73.728-29.696 148.992-45.056 223.744-45.056 14.336 0 25.6 11.264 25.6 25.6s-11.264 25.6-25.6 25.6c-68.096 0-136.704 13.824-204.288 40.96-3.584 1.536-7.168 2.048-10.24 2.048zM643.072 673.792c-10.24 0-19.968-6.144-23.552-15.872-5.12-13.312 1.024-28.16 14.336-33.28 73.728-29.696 148.992-45.056 223.744-45.056 14.336 0 25.6 11.264 25.6 25.6s-11.264 25.6-25.6 25.6c-68.096 0-136.704 13.824-204.288 40.96-3.584 1.536-7.168 2.048-10.24 2.048z" p-id="3626"></path></svg>
            </el-icon>
            <span style="flex: 1">{{ data.name }}</span>
          </div>
        </template>
      </el-tree>
    </div>
  </div>

  <Contextmenu ref="contextMenuRef">
    <template #default="{ data }">
      <template v-if="dirStore.activeMode === 'directory'">
        <!-- 笔记菜单 -->
        <template v-if="data.note">
          <ContextmenuItem v-if="data.note" @click="onCopyLink(data)">复制链接</ContextmenuItem>
          <ContextmenuDivided v-if="data.note" />
          <ContextmenuItem @click="onClickDel(data)">删除</ContextmenuItem>
        </template>
        <!-- 文件夹菜单 -->
        <template v-else>
          <ContextmenuItem @click="onClickDel(data)">删除</ContextmenuItem>
        </template>
      </template>
      <template v-else-if="dirStore.activeMode === 'discrete'">
        <template v-if="data === null">
        </template>
        <template v-else>
          <ContextmenuItem @click="onClickDelNote(data)">删除</ContextmenuItem>
        </template>
      </template>
    </template>
  </Contextmenu>
</template>

<style scoped>
.directory-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--side-bg-color);
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

.tree {
  background-color: var(--side-bg-color);
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
