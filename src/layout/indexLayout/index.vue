<script setup lang="ts">
import { onMounted} from 'vue';

import { useUserStore } from '@/store';
import router, { openBlank, push } from '@/router';

import { clearToken } from '@/utils/auth';
import { getUserInfo, logout } from '@/api/user';

import { Compass, Folder, Setting } from '@element-plus/icons-vue';

const userStore = useUserStore();

const onLogout = () => {
  logout().then(res => {
    clearToken();
    push('/home');
  });
};

onMounted(() => {
  getUserInfo().then(res => userStore.userInfo = res.data);
});
</script>

<template>
  <el-container class="container">
    <el-aside class="aside" width="64px">
      <el-popover placement="right-end" trigger="click">
        <template #reference>
          <el-avatar class="introduce-avatar" :src="userStore.avatarUrl">inote</el-avatar>
        </template>
        <div class="introduce">
          <div>{{ userStore.userInfo?.nickname }}</div>
          <div class="introduce-username">{{ userStore.userInfo?.username }}</div>
        </div>
        <el-button @click="openBlank('/account')">个人中心</el-button>
        <el-button @click="onLogout">退出登录</el-button>
      </el-popover>
      <div class="menu">
        <div class="top-menu">
          <div class="menu-item" @click="router.replace('/index')"><el-icon><Folder /></el-icon></div>
        </div>
        <div class="bottom-menu">
          <div class="menu-item" @click="openBlank('/explore')"><el-icon><Compass /></el-icon></div>
          <div class="menu-item" @click="router.replace('/index/setting')"><el-icon><Setting /></el-icon></div>
        </div>
      </div>
    </el-aside>
    <el-main class="content">
      <router-view />
    </el-main>
  </el-container>
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
  margin: 12px;
  min-width: 40px;
}

.introduce-username {
  color: #999;
  font-size: 8px;
}

.container {
  height: 100%;
}

.aside {
  display: flex;
  flex-direction: column;
  border-right: solid 1px #e6e6e6;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.5s;
}

.menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.menu-item .el-icon {
  width: 100%;
  padding: 16px 0;
  cursor: pointer;
}

.content {
  display: flex;
  padding: 0;
}
</style>
