<script setup lang="ts">
import { useAppStore, useFolderStore, useNoteStore, useUserStore } from '@/store';
import { computed, onMounted, ref } from 'vue';
import { DArrowLeft, DArrowRight, Folder, Plus } from '@element-plus/icons-vue';
import Folders from './components/Folders.vue';
import IconBtn from '@/components/IconBtn.vue';
import Notes from './components/Notes.vue';
import Outline from './components/Outline.vue';
import { getUserInfo, logout } from '@/api/user';
import AddDialog from './components/NoteAddDialog.vue';
import { openBlank, push } from '@/router';
import { clearToken } from '@/utils/auth';
import { folderApi, noteApi } from '@/api';
import { NoteFolderInfo, NotePage, Page } from '@/types';

const addDialogRef = ref<InstanceType<typeof AddDialog>>();

const appStore = useAppStore();
const userStore = useUserStore();
const noteStore = useNoteStore();
const folderStore = useFolderStore();

const menuWidth = computed(() => {
  return appStore.isCollapse ? 64 : 200;
});
const toggleCollapse = () => {
  appStore.isCollapse = !appStore.isCollapse;
};

const tabActiveName = ref<string>('notes');

const dropdownCommand = (command: string) => {
  if (command === 'account') {
    openBlank('/account')
  } else if (command === 'explore') {
    openBlank('/explore')
  } else if (command === 'setting') {
    openBlank('/setting')
  } else if (command === 'logout') {
    logout().then(res => {
      clearToken();
      push('/home');
    });
  }
}

// 引用笔记
const addOptionalNotes = ref<Page<NotePage>>();
const quoteCheckedNote = ref<NotePage[]>([]);
const quoteVisible = ref<boolean>(false);
const quoteLoading = ref<boolean>(false);
const onQuoteOk = () => {
  if (folderStore.currentFolder === null) return;
  if (quoteCheckedNote.value.length === 0) return;
  quoteLoading.value = true;
  const note = quoteCheckedNote.value[0];
  folderApi.addRelevance({ name: note.name, noteId: note.id, folderId: folderStore.currentFolder.id }).then(res => {
    quoteLoading.value = false;
    quoteVisible.value = false;
    noteStore.refresh();
  }).catch(err => {
    quoteLoading.value = false;
  });
};

const plusDropdownCommand = (command: string) => {
  if (command === 'quote') {
    noteApi.getList(100, 1).then(res => {
      addOptionalNotes.value = res.data;
      // 排除已存在笔记 不需要添加
      let currentNoteIds = noteStore.notes.map((item: NoteFolderInfo) => item.noteId);
      const notes: NotePage[] = addOptionalNotes.value.records;
      addOptionalNotes.value.records = notes.filter(note => !currentNoteIds.includes(note.id));
    });
    quoteVisible.value = true;
  } else if (command === 'create') {
    addDialogRef.value?.open(folderStore.currentFolder === null ? 0 : folderStore.currentFolder.id)
  }
};

onMounted(() => {
  getUserInfo().then(res => userStore.userInfo = res.data);
});
</script>

<template>
  <el-container class="container">
    <el-aside class="aside" :width="menuWidth + 'px'">
      <el-dropdown trigger="click" @command="dropdownCommand">
        <div class="introduce">
          <el-avatar class="introduce-avatar" :src="userStore.avatarUrl">inote</el-avatar>
          <span v-if="!appStore.isCollapse" style="flex-shrink: 0">
            <div>{{ userStore.userInfo?.nickname }}</div>
            <div class="introduce-username">{{ userStore.userInfo?.username }}</div>
          </span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="account">个人中心</el-dropdown-item>
            <el-dropdown-item command="explore">探索</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-popover v-if="appStore.isCollapse" placement="right" trigger="hover">
        <template #reference>
          <el-icon class="folder-icon"><Folder /></el-icon>
        </template>
        <Folders />
      </el-popover>
      <Folders v-else />
    </el-aside>
    <el-main class="content">
      <div class="note-aside">
        <el-tabs class="note-tabs" v-model="tabActiveName">
          <el-tab-pane label="笔记" name="notes"><Notes /></el-tab-pane>
          <el-tab-pane label="大纲" name="outline"><Outline /></el-tab-pane>
        </el-tabs>
        <div class="note-tool">
          <IconBtn content="展开/收缩侧边栏" @click="toggleCollapse">
            <el-icon v-if="appStore.isCollapse"><DArrowRight /></el-icon>
            <el-icon v-else><DArrowLeft /></el-icon>
          </IconBtn>
          {{ folderStore.currentFolder?.name }}
          <el-dropdown @command="plusDropdownCommand">
            <IconBtn><el-icon><Plus /></el-icon></IconBtn>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="quote">添加笔记</el-dropdown-item>
                <el-dropdown-item command="create">新建笔记</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <router-view class="main" />
    </el-main>
  </el-container>

  <AddDialog ref="addDialogRef" />

  <el-dialog v-model="quoteVisible" title="添加笔记">
    <el-checkbox-group v-model="quoteCheckedNote" :max="1">
      <el-checkbox v-for="note in addOptionalNotes?.records" :key="note.id" :label="note">
        {{ note.name }} | inote_{{ note.id }}
      </el-checkbox>
  </el-checkbox-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="quoteVisible = false">取消</el-button>
        <el-button type="primary" :loading="quoteLoading" @click="onQuoteOk">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style>
.el-tabs__nav-wrap {
  padding: 0 40px;
}
</style>
<style scoped>
.introduce {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 60px;
  cursor: pointer;
}

.introduce-avatar {
  margin: 0 12px;
  min-width: 40px;
}

.introduce-username {
  color: #999;
  font-size: 8px;
}

.container {
  height: 100%;
}

.folder-icon {
  width: 100%;
  padding: 16px 0;
  cursor: pointer;
}

.folder-icon:hover {
  background-color: #ecf5ff;
}

.aside {
  border-right: solid 1px #e6e6e6;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.5s;
}

.el-menu {
  border: none;
}

.content {
  display: flex;
  padding: 0;
}

.note-aside {
  display: flex;
  flex-direction: column;
  width: 180px;
  background-color: #fafafa;
}

.note-tabs {
  flex: 1;
  height: 100%;
}

.note-tool {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #eee;
}

.main {
  flex: 1;
}
</style>
