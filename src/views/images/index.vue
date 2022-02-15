<script setup lang="ts">
import { ref } from 'vue';
import { GiteeImg } from '@/utils/gitee';
import Directory from './components/Directory.vue';

const imgUrl = ref<string>('');

const nodeClick = (note: GiteeImg) => {
  imgUrl.value = note.imgUrl;
}
</script>

<template>
  <div class="image-aside">
    <Directory @node-click="nodeClick" />
  </div>
  <div class="image-main">
    <el-image class="image" :src="imgUrl" fit="fill" />
  </div>
</template>

<style scoped>
.image-aside {
  height: 100vh;
  width: 200px;
}

.image-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image {
  max-height: 100%;
  max-width: 100%;
  border: 1px solid #eee;
}
</style>
