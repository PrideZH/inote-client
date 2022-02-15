<script setup lang="ts">
import articleApi from '@/api/article';
import { openBlank } from '@/router';
import { useAppStore } from '@/store';
import { Page, ArticlePage } from '@/types';
import { PriceTag } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';
import Tag from '@/components/Tag.vue';

const appStore = useAppStore();

const articles = ref<Page<ArticlePage>>();

onMounted(() => {
  articleApi.getList().then(res => articles.value = res.data);
});
</script>

<template>
  <div class="note-box"
    v-for="article in articles?.records" :key="article.id"
    @click="openBlank(`/article/${article.id}`)"
  >
    <div class="note-introduce">
      <div class="note-name">{{ article.title }}</div>
      <div class="note-content">{{ article.summary }}</div>
      <div class="note-data">
        <el-space :size="24">
          <el-space>
            <el-icon><svg t="1644901672003" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2239"><path d="M857.28 344.992h-264.832c12.576-44.256 18.944-83.584 18.944-118.208 0-78.56-71.808-153.792-140.544-143.808-60.608 8.8-89.536 59.904-89.536 125.536v59.296c0 76.064-58.208 140.928-132.224 148.064l-117.728-0.192A67.36 67.36 0 0 0 64 483.04V872c0 37.216 30.144 67.36 67.36 67.36h652.192a102.72 102.72 0 0 0 100.928-83.584l73.728-388.96a102.72 102.72 0 0 0-100.928-121.824zM128 872V483.04c0-1.856 1.504-3.36 3.36-3.36H208v395.68H131.36A3.36 3.36 0 0 1 128 872z m767.328-417.088l-73.728 388.96a38.72 38.72 0 0 1-38.048 31.488H272V476.864a213.312 213.312 0 0 0 173.312-209.088V208.512c0-37.568 12.064-58.912 34.72-62.176 27.04-3.936 67.36 38.336 67.36 80.48 0 37.312-9.504 84-28.864 139.712a32 32 0 0 0 30.24 42.496h308.512a38.72 38.72 0 0 1 38.048 45.888z" p-id="2240"></path></svg></el-icon>
            <div>{{ article.likeCount }}</div>
          </el-space>
          <el-space>
            <el-icon v-if="article.tagNames.length !== 0"><PriceTag /></el-icon>
            <Tag v-for="tagName in article.tagNames">{{ tagName }}</Tag>
          </el-space>
        </el-space>
        <el-space>
          <el-icon><svg t="1644901931303" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8262"><path d="M858.5 763.6c-18.9-44.8-46.1-85-80.6-119.5-34.5-34.5-74.7-61.6-119.5-80.6-0.4-0.2-0.8-0.3-1.2-0.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-0.4 0.2-0.8 0.3-1.2 0.5-44.8 18.9-85 46-119.5 80.6-34.5 34.5-61.6 74.7-80.6 119.5C146.9 807.5 137 854 136 901.8c-0.1 4.5 3.5 8.2 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c0.1 4.4 3.6 7.8 8 7.8h60c4.5 0 8.1-3.7 8-8.2-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z" p-id="8263"></path></svg></el-icon>
          <div class="note-author" @click="openBlank(`/space/${article.author.id}`)">{{ article.author.nickname }}</div>
          <div>{{ article.updateTime }}</div>
        </el-space>
      </div>
    </div>
    <div class="note-cover" v-if="article.coverUrl">
      <img :src="appStore.BASE_URL + article.coverUrl" />
    </div>
  </div>
</template>

<style scoped>
.note-box {
  display: flex;
  padding: 16px;
  margin: 16px 0;
  background-color: #fff;
  transition: all 0.6s ease;
  box-shadow: 0 5px 15px 0 rgb(146 146 146 / 6%);
  cursor: pointer;
}

.note-introduce {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.note-cover {
  margin-left: 16px;
}

.note-cover img {
  max-width: 132px;
  max-height: 102px;
}

.note-box:hover {
  box-shadow: 0 5px 15px 0 rgb(200 200 200 / 32%);
}

.note-box:hover .note-name {
  color: #00d6ac;
}

.note-name {
  color: #48494d;
  font-size: 24px;
  transition: all 0.6s ease;
}

.note-content {
  flex: 1;
  padding: 8px 4px;
  color: #999;
  font-size: 14px;
}

.note-data {
  display: flex;
  justify-content: space-between;
  color: #8f8f8f;
  font-size: 14px;
}

.note-author {
  margin-right: 8px;
}

.note-author:hover {
  color: #00d6ac;
}
</style>
