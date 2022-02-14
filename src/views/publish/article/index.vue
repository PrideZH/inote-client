<script setup lang="ts">
import { articleApi } from '@/api';
import { openBlank } from '@/router';
import { ArticleInfo } from '@/types';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const articleId = Number(route.params.id);

const article = ref<ArticleInfo>();

onMounted(() => {
  articleApi.getMe(articleId).then(res => {
    article.value = res.data;
  });
});
</script>

<template>
  <div>基本信息</div>
  <div>
    <div>封面</div>
    <div class="title" @click="openBlank(`/article/${article?.id}`)">{{ article?.title }}</div>
    文章简介：{{ article?.summary }}
    文章状态：{{ article?.close ? '关闭' : '开放' }}
    </div>
  <div>数据概览</div>
  <div>阅读量</div>
  <div>点赞数</div>
  <div>评论数</div>
  <div>收藏数</div>
</template>

<style scoped>
.title {
  font-size: 16px;
  cursor: pointer;
}

.title:hover {
  color: #409eff;
}
</style>
