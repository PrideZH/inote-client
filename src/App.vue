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
</style>
