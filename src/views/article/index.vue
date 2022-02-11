<script setup lang="ts">
import { articleApi } from '@/api';
import router from '@/router';
import Vditor from 'vditor';
import { ArticleOpen } from '@/types';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const articleId: number = Number(route.params.id);
if (isNaN(articleId)) {
  router.push('/404');
}

const article = ref<ArticleOpen>();

onMounted(() => {
  articleApi.get(articleId).then(res => {
    article.value = res.data;
    const preview: HTMLElement | null = document.getElementById('preview');
    if (preview !== null) {
      Vditor.preview(preview as HTMLDivElement, article.value.content);
    }
  }).catch(err => {
    if (err.code === 404) router.push('/404');
  });
});
</script>

<template>
  <div class="article-container">
    <div class="breadcrumb"></div>
    <div class="article-info">
      <div class="article-title">{{ article?.title }}</div>
      <div>
        {{article?.createTime}}
        <span>
          标签
          <span v-for="tagName in article?.tagNames">{{ tagName }}</span>
        </span>
      </div>
    </div>
    <div>
      <div id="preview" />
    </div>
  </div>
</template>

<style scoped>
.article-container {
  padding: 16px 80px;
}

.article-title {
  font-size: 32px;
  text-align: center;
}
</style>
