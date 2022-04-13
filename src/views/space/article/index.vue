<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { openBlank, push } from '@/router';
import { useAppStore, useUserStore } from '@/store';
import { ArticlePage, Page } from '@/types';
import Tag from '@/components/Tag.vue';
import { PriceTag } from '@element-plus/icons-vue';
import { TimeUtil } from '@/utils/TimeUtil';
import { useRoute } from 'vue-router';
import { articleApi, userApi } from '@/api';
import { UserInfo } from '@/types/user';

const route = useRoute();

const appStore = useAppStore();
const userStore = useUserStore();

const userId: number = Number(route.params.id);

/**
 * 用户信息
 */
const userVO = ref<UserInfo>();
const isMe = ref<boolean>(false);

/**
 * 文章信息
 */
const articleList = ref<Page<ArticlePage>>();
// 文章包括的所有标签
const tagNames = computed(() => {
  let tagNames: string[] = [];
  if (!articleList.value) return tagNames;
  for (let i = 0; i < articleList.value?.records.length; i++) {
    for (let j = 0; j < articleList.value?.records[i].tagNames.length; j++) {
      tagNames.push(articleList.value?.records[i].tagNames[j]);
    }
  }
  return Array.from(new Set(tagNames));
})

/**
 * 标签选项
 */
const tagActive = ref<string>('1');

onMounted(() => {
  userApi.getUserInfo().then(res => {
    isMe.value = userId === res.data.id;
    if (isMe.value) {
      userVO.value = userStore.userInfo as UserInfo;
      articleApi.getListMe(1, 10).then(res => articleList.value = res.data);
    } else {
      userApi.get(userId).then(res => {
        userVO.value = res.data;
      });
      articleApi.getList(1, 10, undefined, userId).then(res => articleList.value = res.data);
    }
  });
})
</script>

<template>
  <div class="left">
    <el-space class="left-header">
      <div>笔记数：{{ articleList?.total }}</div>
      <div class="zh-tag">
        <div :class="{ 'zh-tag-item': true, 'zh-tag-item-active': tagActive === '1' }" @click="tagActive = '1'">最新发布</div>
        <div :class="{ 'zh-tag-item': true, 'zh-tag-item-active': tagActive === '2' }" @click="tagActive = '2'">最多观看</div>
        <div :class="{ 'zh-tag-item': true, 'zh-tag-item-active': tagActive === '3' }" @click="tagActive = '3'">最多点赞</div>
      </div>
    </el-space>
    <div class="article-card"
      v-for="article in articleList?.records" :key="article.id"
      @click="openBlank(`/article/${article.id}`)"
    >
      <div class="note-introduce">
        <div class="note-name">{{ article.title }}</div>
        <div class="note-data">
          <el-space :size="24">
            <el-space>
              <el-icon><svg t="1644901672003" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2239"><path d="M857.28 344.992h-264.832c12.576-44.256 18.944-83.584 18.944-118.208 0-78.56-71.808-153.792-140.544-143.808-60.608 8.8-89.536 59.904-89.536 125.536v59.296c0 76.064-58.208 140.928-132.224 148.064l-117.728-0.192A67.36 67.36 0 0 0 64 483.04V872c0 37.216 30.144 67.36 67.36 67.36h652.192a102.72 102.72 0 0 0 100.928-83.584l73.728-388.96a102.72 102.72 0 0 0-100.928-121.824zM128 872V483.04c0-1.856 1.504-3.36 3.36-3.36H208v395.68H131.36A3.36 3.36 0 0 1 128 872z m767.328-417.088l-73.728 388.96a38.72 38.72 0 0 1-38.048 31.488H272V476.864a213.312 213.312 0 0 0 173.312-209.088V208.512c0-37.568 12.064-58.912 34.72-62.176 27.04-3.936 67.36 38.336 67.36 80.48 0 37.312-9.504 84-28.864 139.712a32 32 0 0 0 30.24 42.496h308.512a38.72 38.72 0 0 1 38.048 45.888z" p-id="2240"></path></svg></el-icon>
              <div>{{ article.likeCount }}</div>
            </el-space>
            <el-space>
              <div>{{ TimeUtil.friendly(article.updateTime) }}</div>
            </el-space>
            <el-space>
              <el-icon v-if="article.tagNames.length !== 0"><PriceTag /></el-icon>
              <Tag v-for="tagName in article.tagNames">{{ tagName }}</Tag>
            </el-space>
            <el-popover class="more" v-if="isMe" trigger="click" :width="64" placement="bottom-start">
              <template #reference>
                <el-icon class="button" @click.stop=""><svg t="1649588331143" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3176" width="200" height="200"><path d="M243.2 512m-83.2 0a1.3 1.3 0 1 0 166.4 0 1.3 1.3 0 1 0-166.4 0Z" p-id="3177"></path><path d="M512 512m-83.2 0a1.3 1.3 0 1 0 166.4 0 1.3 1.3 0 1 0-166.4 0Z" p-id="3178"></path><path d="M780.8 512m-83.2 0a1.3 1.3 0 1 0 166.4 0 1.3 1.3 0 1 0-166.4 0Z" p-id="3179"></path></svg></el-icon>
              </template>
              <div class="more-item" @click="push(`/index?type=note&n=${article.noteId}`)">编辑</div>
            </el-popover>
          </el-space>
        </div>
      </div>
      <div class="note-cover" v-if="article.coverUrl">
        <img :src="appStore.BASE_URL + article.coverUrl" />
      </div>
    </div>
  </div>
  <div class="right">
    <div class="card">
      <div class="card-header">
        个人资料
        <el-button v-if="isMe" size="small" @click="push('/account/info')">修改资料</el-button>
      </div>
      <el-space class="card-body">
        <el-space>
          <div>UID</div>
          <div>{{ userId }}</div>
        </el-space>
      </el-space>
    </div>
    <div class="card">
      <div class="card-header">
        文章标签
      </div>
      <el-space class="card-body">
        <el-space>
          <Tag v-for="tagName in tagNames">{{ tagName }}</Tag>
        </el-space>
      </el-space>
    </div>
  </div>
</template>

<style>
.el-popper {
  padding: 4px 0 !important;
  min-width: 64px !important;
}
</style>
<style scoped>
.left {
  flex: 1;
  padding: 32px;
  border: 1px solid #eee;
  background-color: #fff;
}

.zh-tag {
  display: flex;
  font-size: 12px;
}

.zh-tag-item {
  padding: 8px 0;
  margin: 0 4px;
  cursor: pointer;
}

.zh-tag-item:hover {
  color: var(--text-color-active);
}

.zh-tag-item-active {
  color: var(--text-color-active);
  border-bottom: 1px solid var(--text-color-active);
}

.article-card {
  display: flex;
  padding: 16px;
  margin: 16px 0;
  background-color: #fff;
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

.button {
  color: #9499A0;
  font-size: 12px;
  cursor: pointer;
}

.button:hover {
  color: var(--text-color-active);
}

.more-item {
  padding: 8px 16px;
  cursor: pointer;
}

.more-item:hover {
  color: #00aeec;
  background-color: #f1f2f3;
}

.note-cover img {
  max-width: 132px;
  max-height: 102px;
}

.note-name {
  color: #48494d;
  font-size: 24px;
  margin-bottom: 8px;
  transition: all 0.6s ease;
}

.article-card:hover .note-name {
  color: #00d6ac;
}

.note-data {
  color: #8f8f8f;
  font-size: 14px;
}

.right {
  width: 300px;
  margin-left: 8px;
}

.card {
  padding: 16px 32px;
  margin-bottom: 8px;
  border: 1px solid #eee;
  background-color: #fff;
}

.card-header {
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.card-body {
  color: #666;
  font-size: 12px;
}
</style>
