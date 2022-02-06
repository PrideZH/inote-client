<script setup lang="ts">
import { useAppStore, useFolderStore } from '@/store';
import { computed, onMounted, ref } from 'vue';
import { DArrowLeft, DArrowRight, Folder, Plus } from '@element-plus/icons-vue';
import Folders from './components/Folders.vue';
import IconBtn from '@/components/IconBtn.vue';
import Notes from './components/Notes.vue';
import Outline from './components/Outline.vue';
import { getUserInfo } from '@/api/user';
import { UserInfo } from '@/types/user';
import AddDialog from './components/NoteAddDialog.vue';

const addDialogRef = ref<InstanceType<typeof AddDialog>>();

const appStore = useAppStore();
const folderStore = useFolderStore();
const menuWidth = computed(() => {
  return appStore.isCollapse ? 64 : 200;
});
const toggleCollapse = () => {
  appStore.isCollapse = !appStore.isCollapse;
};

const tabActiveName = ref<string>('notes');
const onTabClick = (tab: string) => {
  console.log(tab)
};

const userInfo = ref<UserInfo>();

const dropdownCommand = (command: string) => {
  if (command === 'space') {

  } else if (command === 'explore') {

  } else if (command === 'setting') {

  } else if (command === 'logout') {

  }
}

onMounted(() => {
  getUserInfo().then(res => userInfo.value = res.data);
});
</script>

<template>
  <el-container class="container">
    <el-aside class="aside" :width="menuWidth + 'px'">
      <el-dropdown trigger="click" @command="dropdownCommand">
        <div class="introduce">
          <el-avatar class="introduce-avatar" :src="userInfo?.avatar">inote</el-avatar>
          <span v-if="!appStore.isCollapse" style="flex-shrink: 0">
            <div>{{ userInfo?.nickname }}</div>
            <div class="introduce-username">{{ userInfo?.username }}</div>
          </span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="space">个人空间</el-dropdown-item>
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
        <el-tabs class="note-tabs" v-model="tabActiveName" @tab-click="onTabClick">
          <el-tab-pane label="笔记" name="notes"><Notes /></el-tab-pane>
          <el-tab-pane label="大纲" name="outline"><Outline /></el-tab-pane>
        </el-tabs>
        <div class="note-tool">
          <IconBtn content="展开/收缩侧边栏" @click="toggleCollapse">
            <el-icon v-if="appStore.isCollapse"><DArrowRight /></el-icon>
            <el-icon v-else><DArrowLeft /></el-icon>
          </IconBtn>
          {{ folderStore.currentFolder?.name }}
          <IconBtn
            content="新建笔记"
            @click="addDialogRef?.open(folderStore.currentFolder === null ? 0 : folderStore.currentFolder.id as number)"
          >
            <el-icon><Plus /></el-icon>
          </IconBtn>
        </div>
      </div>
      <router-view class="main" />
    </el-main>
  </el-container>

  <AddDialog ref="addDialogRef" />
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
