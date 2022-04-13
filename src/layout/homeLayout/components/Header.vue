<script setup lang="ts">
import router from '@/router';
import { isLogin } from '@/utils/auth';
</script>

<template>
  <div class="header">
    <span class="logo-content" @click="router.push('/home')">iNote</span>
    <div class="header-right">
      <el-menu mode="horizontal" default-active='home'>
        <el-menu-item index="home" @click="router.push('/home')">首页</el-menu-item>
        <el-menu-item index="help" @click="router.push('/note/27')">帮助</el-menu-item>
        <el-menu-item index="log">更新日志</el-menu-item>
        <el-menu-item index="download">下载</el-menu-item>
        <el-menu-item index="explore"  @click="router.push('/explore')">社区</el-menu-item>
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
  min-width: 440px;
  border: none;
}
</style>
