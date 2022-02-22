<script setup lang="ts">
import { articleApi } from '@/api';
import router from '@/router';
import Vditor from 'vditor';
import { ArticleOpen } from '@/types';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import IconBtn from '@/components/IconBtn.vue';
import { Fold } from '@element-plus/icons-vue';
import Tag from '@/components/Tag.vue';

const route = useRoute();

const articleId: number = Number(route.params.id);
if (isNaN(articleId)) {
  router.push('/404');
}

const article = ref<ArticleOpen>();
const isFold = ref<boolean>(false); // 侧边栏是否折叠

onMounted(() => {
  articleApi.get(articleId).then(res => {
    article.value = res.data;
    const preview: HTMLDivElement = document.getElementById('preview') as HTMLDivElement;
    Vditor.preview(preview, article.value.content, {
      mode: 'light',
      after () {
        const outline: HTMLDivElement = document.getElementById('outline') as HTMLDivElement;
        Vditor.outlineRender(preview, outline);
      }
    });
  }).catch(err => {
    if (err.code === 404) router.push('/404');
  });
});
</script>

<template>
  <div class="article-view">
    <div class="article-side" :style="{ width: isFold ? '0' : '280px' }">
      <div class="article-title ">
        {{ article?.title }}
      </div>
      <div class="introduce">
        <!-- {{article?.createTime}} -->
        <el-space>
          <Tag v-for="tagName in article?.tagNames">{{ tagName }}</Tag>
        </el-space>
      </div>
      <div id="outline" />
    </div>
    <div class="article-main" :style="{ marginLeft: isFold ? '0' : '280px' }">
      <div class="article-header">
        <IconBtn class="fold-btn" @click="isFold = !isFold"><el-icon><Fold /></el-icon></IconBtn>
        {{ article?.title }}
      </div>
      <div class="article-content">
        <div id="preview" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-view {
  display: flex;
}

.article-side {
  position: fixed;
  height: calc(100vh - 48px);
  border: 1px solid #ddd;
  background-color: #fafafa;
  overflow: scroll;
  transition: width 0.5s;
}

.introduce {
  padding: 8px 4px;
}

#outline {
  display: block;
  width: 100%;
  padding: 8px 0;
  border-top: 1px solid #eee;
  color: #666;
}

.article-main {
  flex: 1;
  transition: 0.5s;
}

.article-header {
  position: relative;
  height: 32px;
  padding: 8px 16px;
  font-size: 20px;
  font-weight: 200;
  text-align: center;
  line-height: 32px;
  color: #7e888b;
}

.fold-btn {
  position: absolute;
  left: 8px;
  color: #ddd;
}

.article-title {
  font-size: 32px;
  text-align: center;
}

.article-content {
  padding: 4px 80px;
}
</style>
