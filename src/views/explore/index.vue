<script setup lang="ts">
import { push } from '@/router';
import { useAppStore } from '@/store';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ArticleList from './components/ArticleList.vue';
import TagBox from './components/TagBox.vue';
import { Page, ArticlePage } from '@/types';
import { articleApi } from '@/api';
import { StringUtil } from '@/utils/StringUtil';

const route = useRoute();

const search = ref<string>(route.query.s ? String(route.query.s) : '');

const appStore = useAppStore();

const articles = ref<Page<ArticlePage>>();

const onSearch = (keyword: string) => {
  if (StringUtil.isBlank(keyword)) {
    push('/explore');
    articleApi.getList(1, 10).then(res => articles.value = res.data);
  } else {
    push(`/explore?s=${keyword}`);
    articleApi.getList(1, 10, String(keyword).split(' ')).then(res => articles.value = res.data);
  }
}

onMounted(() => {
  onSearch(search.value);
})
</script>

<template>
  <div class="article-header">
    <el-input placeholder="文章搜索..." v-model="search" @keydown.enter="onSearch(search)" />
    <el-button @click="onSearch">搜索</el-button>
  </div>
  <div :class="'explore-view ' + (appStore.isMobile ? 'explore-view-mobile' : 'explore-view-pc')">
    <div class="left-box">
      <ArticleList :articles="articles" @onSearch="onSearch" />
    </div>
    <el-affix v-if="!appStore.isMobile" :offset="48">
      <div class="right-box">
        <TagBox @onSearch="onSearch" />
      </div>
    </el-affix>
  </div>
</template>

<style scoped>
.article-header {
  display: flex;
  padding: 16px 80px 0 80px;
  background-color: #f6f6f6;
}

.article-header .el-input {
  flex: 1;
}

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
