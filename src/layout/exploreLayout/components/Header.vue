<script setup lang="ts">
import router from '@/router';
import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';

const userStore = useUserStore();
</script>

<template>
  <div class="header">
    <span class="logo-content" @click="router.push('/home')">iNote</span>
    <el-input />
    <div class="header-right">
      <el-avatar :src="userStore.avatarUrl">inote</el-avatar>
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
