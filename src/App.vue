<script setup lang="ts">
import { useAppStore } from './store';

const appStore = useAppStore();
</script>

<template>
  <el-progress
    id="global-load-progress"
    v-show="appStore.isLoad"
    :stroke-width="4"
    :percentage="appStore.loadPercent"
    :show-text="false"
  />
  <router-view />
</template>

<style>
body, #app {
  height: 100vh;
  margin: 0;
}

#global-load-progress {
  position: absolute;
  width: 100%;
  z-index: 999;
}


/* 定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸 */
::-webkit-scrollbar
{
	width: 8px;
	height: 8px;
	background-color: #F5F5F5;
}

/* 定义滚动条轨道 */
::-webkit-scrollbar-track
{
	border-radius: 10px;
	background-color: #F5F5F5;
}

/* 定义滑块 */
::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	background-color: #555;
}
</style>
