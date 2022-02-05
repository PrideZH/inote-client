<script setup lang="ts">
import { useAppStore } from '@/store';
import { computed, onMounted, ref } from 'vue';
import { DArrowLeft, DArrowRight, Folder } from '@element-plus/icons-vue';
import Folders from './components/Folders.vue';
import IconBtn from '@/components/IconBtn.vue';
import Notes from './components/Notes.vue';
import Outline from './components/Outline.vue';
import { getUserInfo } from '@/api/user';
import { UserInfo } from '@/types/user';

const appStore = useAppStore();
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

onMounted(() => {
  getUserInfo().then(res => userInfo.value = res.data);
});
</script>

<template>
  <el-container class="container">
    <el-aside class="aside" :width="menuWidth + 'px'">
      <div class="introduce">
        <el-avatar  class="introduce-avatar" :src="userInfo?.avatar">inote</el-avatar>
        <span v-if="!appStore.isCollapse" style="flex-shrink: 0">
          <div>{{ userInfo?.nickname }}</div>
          <div class="introduce-username">{{ userInfo?.username }}</div>
        </span>
      </div>
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
          <el-tab-pane label="notes" name="notes"><Notes /></el-tab-pane>
          <el-tab-pane label="outline" name="outline"><Outline /></el-tab-pane>
        </el-tabs>
        <div class="note-tool">
          <IconBtn content="展开/收缩侧边栏" @click="toggleCollapse">
            <el-icon v-if="appStore.isCollapse"><DArrowRight /></el-icon>
            <el-icon v-else><DArrowLeft /></el-icon>
          </IconBtn>
        </div>
      </div>
      <router-view class="main" />
    </el-main>
  </el-container>
</template>

<style>
.el-tabs__nav-wrap {
  padding: 0 20px;
}
</style>
<style scoped>
.introduce {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 60px;
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
  background-color: #fafafa;
}

.note-tabs {
  flex: 1;
}

.note-tool {
  display: flex;
  border-top: 1px solid #eee;
}

.main {
  flex: 1;
}
</style>
