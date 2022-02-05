<script setup lang="ts">
import router from '@/router';
import { isLogin } from '@/utils/auth';
</script>

<template>
  <div class="header">
    <span class="logo-content" @click="router.push('/home')">iNote</span>
    <div class="header-right">
      <el-menu mode="horizontal" :default-selected-keys="['0']">
        <el-menu-item key="3" @click="router.push('/note/27')">帮助</el-menu-item>
        <el-menu-item key="2">更新日志</el-menu-item>
        <el-menu-item key="1">下载</el-menu-item>
        <el-menu-item key="community"  @click="router.push('/explore')">探索</el-menu-item>
      </el-menu>
      <el-divider direction="vertical" style="margin-right: 24px" />
      <el-button v-if="!isLogin()" @click="router.push('/home/login')">登录</el-button>
      <el-button v-else type="primary" @click="router.push('/index')">工作区</el-button>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 80px;
  background-color: #ffffff;
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
