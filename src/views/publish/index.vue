<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

let activeIndex = ref<string>(route.path);

const accountMenuitems = [
  { index: '/publish/home', locale: '首页' },
  { index: '/publish/note-manager', locale: '笔记管理' },
  { index: '/publish/article-manager', locale: '文章管理' },
  { index: '/publish/comment-manager', locale: '评论管理' }
];

const onSelect = (index: string) => activeIndex.value = index;
</script>

<template>
  <div class="publish-container">
    <el-menu class="publish-menu" :default-active="activeIndex" router @select="onSelect">
      <el-menu-item v-for="item in accountMenuitems" :index="item.index">{{ item.locale }}</el-menu-item>
    </el-menu>
    <div class="publish-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.publish-container {
  height: calc(100% - 48px);
  display: flex;
}

.publish-menu {
  width: 128px;
}

.publish-content {
  flex: 1;
  padding: 32px;
  min-width: 180px;
}
</style>
