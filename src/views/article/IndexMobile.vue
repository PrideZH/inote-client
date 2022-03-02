<script setup lang="ts">
import { articleApi } from '@/api';
import router, { openBlank } from '@/router';
import Vditor from 'vditor';
import { ArticleOpen } from '@/types';
import { onMounted, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import IconBtn from '@/components/IconBtn.vue';
import { ChatLineRound, Fold } from '@element-plus/icons-vue';
import Tag from '@/components/Tag.vue';
import { TimeUtil } from '@/utils/TimeUtil';

const route = useRoute();

const articleId: number = Number(route.params.id);
if (isNaN(articleId)) {
  router.push('/404');
}

const article = ref<ArticleOpen>();
const activeSection = ref<string>('');
const sideDrawer = ref<boolean>(false);

const updateContent = (section: string) => {
  activeSection.value = section;
  const previewDiv: HTMLDivElement = document.getElementById('preview') as HTMLDivElement;
  articleApi.getContent(articleId, section).then(res => {
    Vditor.preview(previewDiv, res.data, {
      mode: 'light',
      after () {
        const outlineDiv: HTMLDivElement = document.getElementById('outline') as HTMLDivElement;
        //Vditor.outlineRender(previewDiv, outlineDiv);
      }
    });
  });
}

onMounted(() => {
  articleApi.get(articleId).then(res => {
    document.title = res.data.title + ' · inote';
    article.value = res.data;
    const hash = decodeURI(window.location.hash);
    if (hash === '') {
      updateContent(res.data.sections[0]);
    } else {
      updateContent(hash.substring(1));
    }
  }).catch(err => {
    if (err.code === 404) router.push('/404');
  });
});

onBeforeRouteUpdate(() => {
  updateContent(decodeURI(window.location.hash).substring(1));
});
</script>

<template>
  <el-drawer v-model="sideDrawer" direction="ltr" size="80%" :with-header="false">
    <div class="article-title ">
      {{ article?.title }}
    </div>
    <div class="introduce">
      <!-- <el-avatar :src="article?.author.avatarUrl">inote</el-avatar>
      <div>{{ article?.author.nickname }}</div> -->
      <el-avatar>inote</el-avatar>
      <div class="introduce-info">
        <div>PrideZH</div>
        <div style="color: #999">
          {{ article ? TimeUtil.dateFormat(article?.createTime, 'yyyy年MM月dd日 hh:mm') : '---' }}
        </div>
        <!-- · 阅读 123 -->
      </div>
    </div>
    <el-space>
      <Tag v-for="tagName in article?.tagNames">{{ tagName }}</Tag>
    </el-space>
    <div class="outline" @click="sideDrawer = false">
      <a class="section-item" v-for="section in article?.sections" :key="section" :href="section ? '#' + section : ''">
        {{ section || article?.title }}
      </a>
    </div>
    <div id="outline" />
  </el-drawer>
  <div class="article-main">
    <div class="article-header">{{ activeSection || article?.title }}</div>
    <div class="article-content">
      <div id="preview" />
    </div>
    <div class="article-btn-group">
      <div class="article-btn" @click="sideDrawer = true">
        <el-icon :size="20"><svg t="1645854928312" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2049" width="200" height="200"><path d="M212 338c-24.852 0-45-20.148-45-45S187.148 248 212 248h600c24.852 0 45 20.148 45 45S836.852 338 812 338H212z m0 220c-24.852 0-45-20.148-45-45S187.148 468 212 468h600c24.852 0 45 20.148 45 45S836.852 558 812 558H212z m0 220c-24.852 0-45-20.148-45-45S187.148 688 212 688h600c24.852 0 45 20.148 45 45S836.852 778 812 778H212z" p-id="2050"></path></svg></el-icon>
      </div>
      <el-badge :value="3" :max="99" type="info">
        <div class="article-btn"><el-icon :size="20"><svg t="1645800277830" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5789" width="200" height="200"><path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4-20.5-21.5-48.1-33.4-77.9-33.4-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-0.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81z m636.4-353l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5c5.2-18.9 22.5-32.2 42.2-32.3 7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z" p-id="5790"></path></svg></el-icon></div>
      </el-badge>
      <el-badge :value="3" :max="99" type="info">
        <div class="article-btn" @click="openBlank(`/article/${article?.id}/comment`)">
          <el-icon :size="20"><ChatLineRound /></el-icon>
        </div>
      </el-badge>
      <!-- <el-popover placement="left-start" trigger="click">
        <template #reference>
          <div class="article-btn"><el-icon :size="20"><svg t="1645800621148" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7537" width="200" height="200"><path d="M752 664c-28.5 0-54.8 10-75.4 26.7L469.4 540.8c1.7-9.3 2.6-19 2.6-28.8s-0.9-19.4-2.6-28.8l207.2-149.9C697.2 350 723.5 360 752 360c66.2 0 120-53.8 120-120s-53.8-120-120-120-120 53.8-120 120c0 11.6 1.6 22.7 4.7 33.3L439.9 415.8C410.7 377.1 364.3 352 312 352c-88.4 0-160 71.6-160 160s71.6 160 160 160c52.3 0 98.7-25.1 127.9-63.8l196.8 142.5c-3.1 10.6-4.7 21.8-4.7 33.3 0 66.2 53.8 120 120 120s120-53.8 120-120-53.8-120-120-120z m0-476c28.7 0 52 23.3 52 52s-23.3 52-52 52-52-23.3-52-52 23.3-52 52-52zM312 600c-48.5 0-88-39.5-88-88s39.5-88 88-88 88 39.5 88 88-39.5 88-88 88z m440 236c-28.7 0-52-23.3-52-52s23.3-52 52-52 52 23.3 52 52-23.3 52-52 52z" p-id="7538"></path></svg></el-icon></div>
        </template>
        <el-icon><svg t="1645798707354" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4315" width="200" height="200"><path d="M618.24 439.381333a152.746667 152.746667 0 0 1 0 216l-135.893333 135.893334a163.370667 163.370667 0 1 1-231.04-231.04l66.922666-66.944 45.269334 45.269333-66.944 66.944a99.370667 99.370667 0 1 0 140.522666 140.522667l135.893334-135.893334a88.746667 88.746667 0 0 0 0-125.482666z m182.528-197.589333a163.370667 163.370667 0 0 1 0 231.04L733.866667 539.776l-45.269334-45.248 66.944-66.944a99.370667 99.370667 0 1 0-140.522666-140.522667l-135.893334 135.893334a88.746667 88.746667 0 0 0 0 125.482666l-45.269333 45.269334a152.746667 152.746667 0 0 1 0-216l135.893333-135.893334a163.370667 163.370667 0 0 1 231.04 0z" p-id="4316"></path></svg></el-icon>
        复制链接
      </el-popover> -->
      <div class="article-btn"><el-icon :size="20"><svg t="1645800537380" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6728" width="200" height="200"><path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3-12.3 12.7-12.1 32.9 0.6 45.3l183.7 179.1-43.4 252.9c-1.2 6.9-0.1 14.1 3.2 20.3 8.2 15.6 27.6 21.7 43.2 13.4L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z" p-id="6729"></path></svg></el-icon></div>
    </div>
  </div>
</template>

<style scoped>
.article-side:hover {
  overflow: scroll;
}

.article-title {
  padding: 8px;
  font-size: 32px;
  text-align: center;
}

.introduce {
  display: flex;
  align-items: center;
  padding: 8px 32px;
  font-size: 12px;
  border-top: 1px solid #eee;
}

.introduce-info {
  flex: 1;
  padding: 0 16px;
}

.outline {
  display: flex;
  flex-direction: column;
  padding: 4px 16px;
  border-top: 1px solid #eee;
}

.section-item {
  padding: 0.25rem 1.25rem;
  color: #444;
  text-decoration: none;
}

.section-item:hover {
  text-decoration: underline;
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
  height: calc(100vh - 48px);
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

.article-content {
  padding: 4px 24px;
}

.article-btn-group {
  position: fixed;
  display: flex;
  bottom: 16px;
  justify-content: space-evenly;
  width: calc(100% - 64px);
  padding: 8px 0;
  margin: 0 32px;
  border-radius: 8px;
  box-shadow: 0 0 6px rgb(0 0 0 / 12%);
}

.article-btn {
  color: #8a919f;
  cursor: pointer;
}

.article-btn:hover {
  background-color: #f2f6fc;
}
</style>
