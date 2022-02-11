<script setup lang="ts">
import { logout } from '@/api/user';
import router, { openBlank, push } from '@/router';
import { useUserStore } from '@/store';
import { clearToken, isLogin } from '@/utils/auth';

const userStore = useUserStore();

const dropdownCommand = (command: string) => {
  if (command === 'space') {
    openBlank('/space')
  } else if (command === 'article') {
    openBlank('/publish')
  } else if (command === 'logout') {
    logout().then(res => {
      clearToken();
      push('/home');
    });
  }
}
</script>

<template>
  <div class="header">
    <span class="logo-content" @click="router.push('/home')">iNote</span>
    <el-input />
    <div class="header-right">
      <el-dropdown @command="dropdownCommand">
        <el-avatar :src="userStore.avatarUrl">inote</el-avatar>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="space">个人空间</el-dropdown-item>
            <el-dropdown-item command="article">文章管理</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button v-if="!isLogin()" @click="router.push('/home/login')">登录</el-button>
      <el-button v-else @click="router.push('/index')">工作区</el-button>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 5%);
  position: relative;
}

.logo-content {
  font-size: 40px;
  cursor: pointer;
}

.header-right {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.el-menu {
  justify-content: flex-end;
  min-width: 400px;
  border: none;
}
</style>
