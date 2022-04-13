<script setup lang="ts">
import { articleApi } from '@/api';
import router, { openBlank } from '@/router';
import Vditor from 'vditor';
import { ArticleOpen } from '@/types';
import { nextTick, onMounted, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { ChatLineRound } from '@element-plus/icons-vue';
import Tag from '@/components/Tag.vue';
import { TimeUtil } from '@/utils/TimeUtil';
import { useAppStore } from '@/store';
import likeApi from '@/api/like';
import { StringUtil } from '@/utils/StringUtil';

const route = useRoute();

const articleId: number = Number(route.params.id);
if (isNaN(articleId)) {
  router.push('/404');
}

const appStore = useAppStore();

const article = ref<ArticleOpen>();
const activeSection = ref<string>('');
const isFold = ref<boolean>(false); // 侧边栏是否折叠

const hash = ref<string>(decodeURI(window.location.hash).substring(1));

const updateContent = (section: string) => {
  activeSection.value = section;
  const previewDiv: HTMLDivElement = document.getElementById('preview') as HTMLDivElement;
  articleApi.getContent(articleId, StringUtil.isEmpty(section) ? undefined : section).then(res => {
    Vditor.preview(previewDiv, res.data, {
      mode: 'light',
      after () {
        const outlineDiv: HTMLDivElement = document.getElementById('outline') as HTMLDivElement;
        Vditor.outlineRender(previewDiv, outlineDiv);
      }
    });
  });
}

const onLike = () => {
  likeApi.like({ type: 0, targetId: article.value?.id as number }).then(res => {
    if (!article.value) return;
    article.value.likeCount += article.value.active ? -1 : 1;
    article.value.active = !article.value.active;
  });
}

onMounted(() => {
  articleApi.get(articleId).then(res => {
    document.title = res.data.title + ' · inote';
    article.value = res.data;
    updateContent(hash.value);
  }).catch(err => {
    if (err.code === 404) router.push('/404');
  });
});

onBeforeRouteUpdate(() => {
  hash.value = decodeURI(window.location.hash).substring(1);
  updateContent(hash.value);
});
</script>

<template>
  <div class="article-view">
    <div class="article-side" :style="{ width: isFold ? '0' : '280px' }">
      <div class="article-title ">
        {{ article?.title }}
      </div>
      <div class="author">
        <el-avatar
          class="author-avatar"
          :src="article?.author.avatarUrl ? appStore.BASE_URL + article?.author.avatarUrl : ''"
          @click="openBlank(`/space/${article?.author.id}`)"
        >
          inote
        </el-avatar>
        <div class="author-info">
          <div class="author-nickname" @click="openBlank(`/space/${article?.author.id}`)">{{ article?.author.nickname }}</div>
        </div>
      </div>
      <div class="outline-view">
        <div class="outline">
          <a
            v-for="section in article?.sections" :key="section" :href="section ? '#' + section : '#'"
            :class="{ 'section-item': true, 'section-item-active':  hash === section }"
          >
            {{ section || article?.title }}
          </a>
        </div>
        <div id="outline" />
      </div>
      <div class="side-footer">
        本文章使用 <el-button type="text">inote</el-button> 构建
      </div>
    </div>
    <div class="article-main"
      :style="{ marginLeft: isFold ? '0' : '280px', width: isFold ? '100%' : 'calc(100% - 280px)' }"
    >
      <div class="article-header">
        {{ activeSection || article?.title }}
      </div>
      <div class="introduce">
        <el-space class="introduce-info">
          <el-space>
            <el-icon><svg t="1649597537917" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3072" width="200" height="200"><path d="M512.3 276.9c-228.4 0-374 178.5-393.8 255.9 19.3 78.2 165.5 256 393.8 256s373.8-176.5 393.9-256c-19.7-78.2-165.6-255.9-393.9-255.9z m0 452.9c-182.3 0-303.2-131.1-331.5-196.7C209.6 467.4 331.2 336 512.3 336c181.9 0 303 131.2 331.5 196.9-28.6 65.6-149.8 196.9-331.5 196.9z" fill="#666666" p-id="3073"></path><path d="M512.3 434.4c-54.4 0-98.4 44.1-98.4 98.5s44.1 98.4 98.4 98.4c54.4 0 98.5-44.1 98.5-98.4 0-54.4-44.1-98.5-98.5-98.5z m0 137.9c-21.7 0-39.4-17.7-39.4-39.4s17.6-39.4 39.4-39.4 39.4 17.7 39.4 39.4-17.7 39.4-39.4 39.4z" fill="#666666" p-id="3074"></path></svg></el-icon>
            <div>{{ article?.viewCount }}</div>
          </el-space>
          <el-space>
            <el-icon><svg t="1649597881230" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4196" width="200" height="200"><path d="M512 64c-256 0-460.8 208-460.8 460.8s208 460.8 460.8 460.8 460.8-208 460.8-460.8S768 64 512 64zM512 940.8c-227.2 0-412.8-185.6-412.8-412.8s185.6-412.8 412.8-412.8 412.8 185.6 412.8 412.8S742.4 940.8 512 940.8z" p-id="4197"></path><path d="M809.6 544l-278.4 0 0-281.6c0-12.8-9.6-22.4-22.4-22.4-12.8 0-22.4 9.6-22.4 22.4l0 307.2c0 12.8 9.6 22.4 22.4 22.4 0 0 3.2 0 3.2 0l297.6 0c12.8 0 22.4-9.6 22.4-22.4C832 553.6 822.4 544 809.6 544z" p-id="4198"></path></svg></el-icon>
            <div>{{ article ? TimeUtil.dateFormat(article?.updateTime, 'yyyy年MM月dd日 hh:mm') : '---' }}</div>
          </el-space>
          <el-space>
            <el-icon><svg t="1649597422616" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2234" width="200" height="200"><path d="M469.333533 968.08a52.986667 52.986667 0 0 1-37.713333-15.62l-416-416A52.986667 52.986667 0 0 1 0.0002 498.746667V138.666667a53.393333 53.393333 0 0 1 53.333333-53.333334h360.08a52.986667 52.986667 0 0 1 37.713334 15.62l416 416a53.4 53.4 0 0 1 0 75.426667l-360.08 360.08a52.986667 52.986667 0 0 1-37.713334 15.62zM53.333533 128a10.666667 10.666667 0 0 0-10.666666 10.666667v360.08a10.573333 10.573333 0 0 0 3.126666 7.54l416 416a10.666667 10.666667 0 0 0 15.08 0l360.08-360.08a10.666667 10.666667 0 0 0 0-15.08l-416-416a10.573333 10.573333 0 0 0-7.54-3.126667z m224 341.333333c-58.813333 0-106.666667-47.853333-106.666666-106.666666s47.853333-106.666667 106.666666-106.666667 106.666667 47.853333 106.666667 106.666667-47.853333 106.666667-106.666667 106.666666z m0-170.666666a64 64 0 1 0 64 64 64.073333 64.073333 0 0 0-64-64z m335.086667 676.42l382.706667-382.706667a53.4 53.4 0 0 0 0-75.426667L569.753533 91.58a21.333333 21.333333 0 0 0-30.173333 30.173333l425.373333 425.373334a10.666667 10.666667 0 0 1 0 15.08l-382.706666 382.706666a21.333333 21.333333 0 0 0 30.173333 30.173334z" fill="#5C5C66" p-id="2235"></path></svg></el-icon>
            <Tag v-for="tagName in article?.tagNames">{{ tagName }}</Tag>
          </el-space>
        </el-space>
      </div>
      <div class="article-content">
        <div id="preview" />
      </div>
      <div class="article-btn-group">
        <el-badge :value="article?.likeCount" :max="99" type="info">
          <div class="article-btn" @click="onLike">
            <el-icon v-if="article?.active" class="like-active"><svg t="1649600075090" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5406" width="200" height="200"><path d="M884.875894 423.143253 646.970506 423.143253c92.185562-340.464205-63.516616-357.853247-63.516616-357.853247-65.993017 0-52.312436 52.182476-57.3031 60.881602 0 166.502152-176.849824 296.971645-176.849824 296.971645l0 472.171899c0 46.607504 63.516616 63.393819 88.433098 63.393819l357.452111 0c33.641191 0 61.036122-88.224344 61.036122-88.224344 88.434122-300.70569 88.434122-390.177444 88.434122-390.177444C944.657442 418.179195 884.875894 423.143253 884.875894 423.143253L884.875894 423.143253 884.875894 423.143253zM884.875894 423.143253M251.671415 423.299819 109.214912 423.299819c-29.420053 0-29.873378 28.89612-29.873378 28.89612l29.420053 476.202703c0 30.309306 30.361495 30.309306 30.361495 30.309306L262.420223 958.707948c25.686009 0 25.458835-20.049638 25.458835-20.049638L287.879058 459.411271C287.879058 422.837284 251.671415 423.299819 251.671415 423.299819L251.671415 423.299819 251.671415 423.299819zM251.671415 423.299819" p-id="5407"></path></svg></el-icon>
            <el-icon v-else><svg t="1649587589060" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2238" width="200" height="200"><path d="M832 364.8h-147.2s19.2-64 32-179.2c6.4-57.6-38.4-115.2-102.4-121.6h-12.8c-51.2 0-83.2 32-102.4 76.8l-38.4 96c-32 64-57.6 102.4-76.8 115.2-25.6 12.8-121.6 12.8-128 12.8H128c-38.4 0-64 25.6-64 57.6v480c0 32 25.6 57.6 64 57.6h646.4c96 0 121.6-64 134.4-153.6l51.2-307.2c6.4-70.4-6.4-134.4-128-134.4z m-576 537.6H128V422.4h128v480z m640-409.6l-51.2 307.2c-12.8 57.6-12.8 102.4-76.8 102.4H320V422.4c44.8 0 70.4-6.4 89.6-19.2 32-12.8 64-64 108.8-147.2 25.6-64 38.4-96 44.8-102.4 6.4-19.2 19.2-32 44.8-32h6.4c32 0 44.8 32 44.8 51.2-12.8 102.4-32 166.4-32 166.4l-25.6 83.2h243.2c19.2 0 32 0 44.8 12.8 12.8 12.8 6.4 38.4 6.4 57.6z" p-id="2239"></path></svg></el-icon>
          </div>
        </el-badge>
        <el-badge :value="article?.commentCount" :max="99" type="info">
          <div class="article-btn" @click="openBlank(`/article/${article?.id}/comment`)">
            <el-icon :size="20"><ChatLineRound /></el-icon>
          </div>
        </el-badge>
        <el-popover placement="left-start" trigger="click">
          <template #reference>
            <div class="article-btn"><el-icon :size="20"><svg t="1645800621148" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7537" width="200" height="200"><path d="M752 664c-28.5 0-54.8 10-75.4 26.7L469.4 540.8c1.7-9.3 2.6-19 2.6-28.8s-0.9-19.4-2.6-28.8l207.2-149.9C697.2 350 723.5 360 752 360c66.2 0 120-53.8 120-120s-53.8-120-120-120-120 53.8-120 120c0 11.6 1.6 22.7 4.7 33.3L439.9 415.8C410.7 377.1 364.3 352 312 352c-88.4 0-160 71.6-160 160s71.6 160 160 160c52.3 0 98.7-25.1 127.9-63.8l196.8 142.5c-3.1 10.6-4.7 21.8-4.7 33.3 0 66.2 53.8 120 120 120s120-53.8 120-120-53.8-120-120-120z m0-476c28.7 0 52 23.3 52 52s-23.3 52-52 52-52-23.3-52-52 23.3-52 52-52zM312 600c-48.5 0-88-39.5-88-88s39.5-88 88-88 88 39.5 88 88-39.5 88-88 88z m440 236c-28.7 0-52-23.3-52-52s23.3-52 52-52 52 23.3 52 52-23.3 52-52 52z" p-id="7538"></path></svg></el-icon></div>
          </template>
          <el-icon><svg t="1645798707354" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4315" width="200" height="200"><path d="M618.24 439.381333a152.746667 152.746667 0 0 1 0 216l-135.893333 135.893334a163.370667 163.370667 0 1 1-231.04-231.04l66.922666-66.944 45.269334 45.269333-66.944 66.944a99.370667 99.370667 0 1 0 140.522666 140.522667l135.893334-135.893334a88.746667 88.746667 0 0 0 0-125.482666z m182.528-197.589333a163.370667 163.370667 0 0 1 0 231.04L733.866667 539.776l-45.269334-45.248 66.944-66.944a99.370667 99.370667 0 1 0-140.522666-140.522667l-135.893334 135.893334a88.746667 88.746667 0 0 0 0 125.482666l-45.269333 45.269334a152.746667 152.746667 0 0 1 0-216l135.893333-135.893334a163.370667 163.370667 0 0 1 231.04 0z" p-id="4316"></path></svg></el-icon>
          复制链接
        </el-popover>
        <div class="article-btn"><el-icon :size="20"><svg t="1645800537380" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6728" width="200" height="200"><path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3-12.3 12.7-12.1 32.9 0.6 45.3l183.7 179.1-43.4 252.9c-1.2 6.9-0.1 14.1 3.2 20.3 8.2 15.6 27.6 21.7 43.2 13.4L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z" p-id="6729"></path></svg></el-icon></div>
      </div>
      <el-backtop :bottom="64" :right="16" :style="{color: '#8a919f'}" />
    </div>
  </div>
</template>

<style scoped>
.article-view {
  display: flex;
}

.article-side {
  display: flex;
  flex-direction: column;
  position: fixed;
  margin-right: 8px;
  height: 100vh;
  border: 1px solid #ddd;
  background-color: #fafafa;
  transition: width 0.5s;
  box-sizing: border-box;
}

.article-title {
  padding: 8px;
  font-size: 32px;
  text-align: center;
}

.introduce {
  padding: 8px 32px;
  font-size: 12px;
}

.introduce-info {
  font-size: 14px;
  color: #999;
}

.author {
  display: flex;
  align-items: center;
  padding: 8px 32px;
  font-size: 12px;
  border-top: 1px solid #eee;
}

.author-avatar {
  cursor: pointer;
}

.author-info {
  flex: 1;
  padding: 0 16px;
}

.author-nickname {
  cursor: pointer;
}

.author-nickname:hover {
  color: var(--text-color-active);
}

.outline-view {
  flex: 1;
  overflow: hidden;
}

.outline-view:hover {
  overflow: scroll;
}

.outline {
  display: flex;
  flex-direction: column;
  padding: 4px 16px;
  border-top: 1px solid #eee;
}

.section-item {
  padding: 0.25rem 1.25rem;
  color: #666;
  text-decoration: none;
}

.section-item-active {
  color: #4cd4ac;
  border-left: 3px solid #4cd4ac;
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

.side-footer {
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-top: 1px solid #eee;
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
  padding: 4px 80px 4px 24px;
}

.article-btn-group {
  position: fixed;
  display: flex;
  flex-direction: column;
  right: 16px;
  top: 32px;
}

.article-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: #8a919f;
  border-radius: 50%;
  box-shadow: 0 0 6px rgb(0 0 0 / 12%);
  cursor: pointer;
}

.like-active {
  color: var(--text-color-active);
}

.article-btn:hover {
  background-color: #f2f6fc;
}
</style>
