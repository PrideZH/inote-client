<script setup lang="ts">
import { useAppStore } from '@/store';
import ArticleList from './components/ArticleList.vue';
import TagBox from './components/TagBox.vue';

const appStore = useAppStore();
</script>

<template>
  <div :class="'explore-view ' + (appStore.isMobile ? 'explore-view-mobile' : 'explore-view-pc')">
    <div class="left-box">
      <ArticleList />
    </div>
    <el-affix v-if="!appStore.isMobile" :offset="48">
      <div class="right-box">
        <TagBox />
      </div>
    </el-affix>
  </div>
</template>

<style scoped>
.explore-view {
  display: flex;
  min-height: calc(100% - 48px);
  background-color: #f6f6f6;
}
.explore-view-pc {
  padding: 0 80px;
}
.explore-view-mobile {
  padding: 0;
}

.left-box {
  flex: 1;
  padding: 16px;
}

.right-box {
  width: 256px;
  padding: 16px;
}
</style>
