<script setup lang="ts">
import articleApi from '@/api/article';
import { openBlank } from '@/router';
import { Page, ArticlePage } from '@/types';
import { onMounted, ref } from 'vue';

const data = [
  {
    id: 1,
    name: 'title',
    content: 'test test test test test test test test test test test test test test ...',
    cover: 'http://blog.51weblove.com/wp-content/uploads/2019/12/2019120511570034-e1575518238834.jpeg',
    commentCount: 32,
    likeCount: 123,
    starCount: 32,
    author: {
      id: 1,
      nickname: 'PrideZH'
    }
  }
];

const articles = ref<Page<ArticlePage>>();

onMounted(() => {
  articleApi.getList().then(res => articles.value = res.data);
});
</script>

<template>
  <div class="note-box" v-for="note in data" :key="note.id">
    <div class="note-introduce">
      <div class="note-name">{{ note.name }}</div>
      <div class="note-content">{{ note.content }}</div>
      <div class="note-data">
        <div>{{ note.likeCount }} {{ note.starCount }} {{note.commentCount}}</div>
        <div>
          <span class="note-author">{{ note.author?.nickname }}</span>
          <span>2019-03-19</span>
        </div>
      </div>
    </div>
    <div class="note-cover" v-if="note.cover">
      <img :src="note.cover" />
    </div>
  </div>
  <div class="note-box"
    v-for="article in articles?.records" :key="article.id"
    @click="openBlank(`/article/${article.id}`)"
  >
    <div class="note-introduce">
      <div class="note-name">{{ article.title }}</div>
      <div class="note-content">{{ article.summary }}</div>
      <div class="note-data">
        <!-- <div>{{ article.likeCount }} {{ note.starCount }} {{note.commentCount}}</div> -->
        <div>
          <span class="note-author">{{ article.author.nickname }}</span>
          <span>{{ article.updateTime }}</span>
        </div>
      </div>
    </div>
    <div class="note-cover" v-if="article.coverUrl">
      <img :src="article.coverUrl" />
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
  width: 132px;
  height: 102px;
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
