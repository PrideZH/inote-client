<script setup lang="ts">
import replyApi, { ReplyOutline } from '@/api/reply';
import commentApi, { CommentOutline } from '@/api/comment';
import likeApi from '@/api/like';
import router from '@/router';
import { useAppStore, useUserStore } from '@/store';
import { Page, UserPage } from '@/types';
import { TimeUtil } from '@/utils/TimeUtil';
import { ElDivider, ElMessage } from 'element-plus';
import { h, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const articleId: number = Number(route.params.id);
if (isNaN(articleId)) {
  router.push('/404');
}

const userStore = useUserStore();
const appStore = useAppStore();

const commentList = ref<Page<CommentOutline>>();
const commentContent = ref<string>('');

const onReview = () => {
  commentContent.value = commentContent.value.trim();
  if (commentContent.value === '') return;
  commentApi.add({ articleId, content: commentContent.value }).then(res => {
    commentList.value?.records.unshift(res.data);
    ElMessage.success('评论成功');
  });
  commentContent.value = '';
}

const onDeleteComment = (index: number) => {
  if (!commentList.value) return;
  commentApi.del(commentList.value.records[index].id).then(res => {
    ElMessage.success('删除成功');
    commentList.value?.records.splice(index, 1);
  })
}

const onLikeComment = (comment: CommentOutline) => {
  likeApi.like({ type: 1, targetId: comment.id }).then(res => {
    comment.likeCount += comment.active ? -1 : 1;
    comment.active = !comment.active;
  });
}

/**
 * 回复
 */
const replyIndex = ref<number | null>(null);
const replyContent = ref<string>('');
const toUser = ref<UserPage | null>(null);

const onPrepareReply = (index: number, __toUser: UserPage | null = null) => {
  replyContent.value = '';
  replyIndex.value = index;
  if (__toUser === null) {
    toUser.value = commentList.value?.records[index].user as UserPage;
  } else {
    toUser.value = __toUser;
  }
}

const onCancelReply = () => {
  replyIndex.value = null;
  toUser.value = null;
}

const onReply = () => {
  if (replyIndex.value === null || toUser.value === null) return;
  replyApi.add({ commentId: commentList.value?.records[replyIndex.value].id, toUserId: toUser.value.id, content: replyContent.value }).then(res => {
    if (replyIndex.value === null) return;
    commentList.value?.records[replyIndex.value].replyPage.records.unshift(res.data);
    replyIndex.value = null;
  });
}

const onDeleteReply = (commentIndex: number, index: number) => {
  replyApi.del(commentList.value?.records[commentIndex].replyPage.records[index].id as number).then(res => {
    ElMessage.success('删除成功');
    commentList.value?.records[commentIndex].replyPage.records.splice(index, 1);
  });
}

const onLikeReply = (reply: ReplyOutline) => {
  likeApi.like({ type: 2, targetId: reply.id }).then(res => {
    reply.likeCount += reply.active ? -1 : 1;
    reply.active = !reply.active;
  });
}

/**
 * 评论分页
 */
const page = ref<number>(Number(route.params.page) || 1);
const sort = ref<string>(route.params.sort as string || 'HOT');

const onListComment = (__sort: string | null) => {
  if (__sort !== null) sort.value = __sort;
  commentApi.list(articleId, sort.value, page.value, 20).then(res => {
    commentList.value = res.data;
    router.push(`/article/${articleId}/comment?sort=${sort.value}&page=${page.value}`);
  });
}

watch(() => page.value, () => {
  onListComment(null);
});

/**
 * 回复分页
 */
const onListReply = (comment: CommentOutline) => {
  replyApi.list(comment.id as number, comment.page, 6).then(res => {
    comment.replyPage = res.data;
  });
}

onMounted(() => {
  onListComment(null);
});
</script>

<template>
  <div class="comment-view">
    <div class="comment-main">
      <div class="title">评论</div>
      <div class="comment-publish">
        <div class="comment-publish-avatar">
          <el-avatar :src="userStore.avatarUrl">inote</el-avatar>
        </div>
        <div class="comment-publish-main">
          <el-input type="textarea" v-model="commentContent" />
          <el-button class="comment-publish-buttom" @click="onReview">发布</el-button>
        </div>
      </div>
      <div class="commnet-header">
        <div class="title">全部评论 {{ commentList?.total }}</div>
        <el-space :spacer="h(ElDivider, { direction: 'vertical' })">
          <a :class="{'comment-header-btn': true, 'sort-active': sort === 'HOT' }" @click="onListComment('HOT')">最热</a>
          <a :class="{'comment-header-btn': true, 'sort-active': sort === 'NEW' }" @click="onListComment('NEW')">最新</a>
        </el-space>
      </div>
      <div class="comment-item" v-for="(comment, index) in commentList?.records" :key="comment.id">
        <div class="comment-item-avatar">
          <el-avatar :src="appStore.BASE_URL + comment.user.avatarUrl">inote</el-avatar>
        </div>
        <div class="comment-item-main">
          <div class="comment-user-nickname">{{ comment.user.nickname }}</div>
          <div class="comment-content">{{ comment.content }}</div>
          <el-space :size="24" class="comment-info">
            <div class="comment-time">{{ TimeUtil.friendly(comment.updateTime) }}</div>
            <el-space class="text-button" @click="onLikeComment(comment)">
              <el-icon v-if="comment.active" class="like-active"><svg t="1649600075090" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5406" width="200" height="200"><path d="M884.875894 423.143253 646.970506 423.143253c92.185562-340.464205-63.516616-357.853247-63.516616-357.853247-65.993017 0-52.312436 52.182476-57.3031 60.881602 0 166.502152-176.849824 296.971645-176.849824 296.971645l0 472.171899c0 46.607504 63.516616 63.393819 88.433098 63.393819l357.452111 0c33.641191 0 61.036122-88.224344 61.036122-88.224344 88.434122-300.70569 88.434122-390.177444 88.434122-390.177444C944.657442 418.179195 884.875894 423.143253 884.875894 423.143253L884.875894 423.143253 884.875894 423.143253zM884.875894 423.143253M251.671415 423.299819 109.214912 423.299819c-29.420053 0-29.873378 28.89612-29.873378 28.89612l29.420053 476.202703c0 30.309306 30.361495 30.309306 30.361495 30.309306L262.420223 958.707948c25.686009 0 25.458835-20.049638 25.458835-20.049638L287.879058 459.411271C287.879058 422.837284 251.671415 423.299819 251.671415 423.299819L251.671415 423.299819 251.671415 423.299819zM251.671415 423.299819" p-id="5407"></path></svg></el-icon>
              <el-icon v-else><svg t="1649587589060" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2238" width="200" height="200"><path d="M832 364.8h-147.2s19.2-64 32-179.2c6.4-57.6-38.4-115.2-102.4-121.6h-12.8c-51.2 0-83.2 32-102.4 76.8l-38.4 96c-32 64-57.6 102.4-76.8 115.2-25.6 12.8-121.6 12.8-128 12.8H128c-38.4 0-64 25.6-64 57.6v480c0 32 25.6 57.6 64 57.6h646.4c96 0 121.6-64 134.4-153.6l51.2-307.2c6.4-70.4-6.4-134.4-128-134.4z m-576 537.6H128V422.4h128v480z m640-409.6l-51.2 307.2c-12.8 57.6-12.8 102.4-76.8 102.4H320V422.4c44.8 0 70.4-6.4 89.6-19.2 32-12.8 64-64 108.8-147.2 25.6-64 38.4-96 44.8-102.4 6.4-19.2 19.2-32 44.8-32h6.4c32 0 44.8 32 44.8 51.2-12.8 102.4-32 166.4-32 166.4l-25.6 83.2h243.2c19.2 0 32 0 44.8 12.8 12.8 12.8 6.4 38.4 6.4 57.6z" p-id="2239"></path></svg></el-icon>
              {{ comment.likeCount }}
            </el-space>
            <div v-if="replyIndex === index" class="text-button" @click="onCancelReply">取消回复</div>
            <div v-else class="text-button" @click="onPrepareReply(index)">回复</div>
            <el-popover class="more" v-if="comment.user.id === userStore.userInfo?.id" trigger="click" :width="64" placement="bottom-start">
              <template #reference>
                <el-icon class="text-button"><svg t="1649588331143" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3176" width="200" height="200"><path d="M243.2 512m-83.2 0a1.3 1.3 0 1 0 166.4 0 1.3 1.3 0 1 0-166.4 0Z" p-id="3177"></path><path d="M512 512m-83.2 0a1.3 1.3 0 1 0 166.4 0 1.3 1.3 0 1 0-166.4 0Z" p-id="3178"></path><path d="M780.8 512m-83.2 0a1.3 1.3 0 1 0 166.4 0 1.3 1.3 0 1 0-166.4 0Z" p-id="3179"></path></svg></el-icon>
              </template>
              <div class="more-item" @click="onDeleteComment(index)">删除</div>
            </el-popover>
          </el-space>
          <div class="comment-item" v-for="(reply, rIndex) in comment.replyPage.records" :key="reply.id">
            <div class="comment-item-avatar">
              <el-avatar :src="appStore.BASE_URL + reply.user.avatarUrl">inote</el-avatar>
            </div>
            <div class="reply-item-main">
              <el-space>
                <div class="comment-user-nickname">{{ reply.user.nickname }}</div>
                <div v-if="reply.atUser.id !== comment.user.id">回复 <el-button type="text">@{{ reply.atUser.nickname }}</el-button></div>
              </el-space>
              <div class="comment-content">{{ reply.content }}</div>
              <el-space :size="24" class="comment-info">
                <div class="comment-time">{{ TimeUtil.friendly(reply.updateTime) }}</div>
                <el-space class="text-button" @click="onLikeReply(reply)">
                  <el-icon v-if="reply.active" class="like-active"><svg t="1649600075090" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5406" width="200" height="200"><path d="M884.875894 423.143253 646.970506 423.143253c92.185562-340.464205-63.516616-357.853247-63.516616-357.853247-65.993017 0-52.312436 52.182476-57.3031 60.881602 0 166.502152-176.849824 296.971645-176.849824 296.971645l0 472.171899c0 46.607504 63.516616 63.393819 88.433098 63.393819l357.452111 0c33.641191 0 61.036122-88.224344 61.036122-88.224344 88.434122-300.70569 88.434122-390.177444 88.434122-390.177444C944.657442 418.179195 884.875894 423.143253 884.875894 423.143253L884.875894 423.143253 884.875894 423.143253zM884.875894 423.143253M251.671415 423.299819 109.214912 423.299819c-29.420053 0-29.873378 28.89612-29.873378 28.89612l29.420053 476.202703c0 30.309306 30.361495 30.309306 30.361495 30.309306L262.420223 958.707948c25.686009 0 25.458835-20.049638 25.458835-20.049638L287.879058 459.411271C287.879058 422.837284 251.671415 423.299819 251.671415 423.299819L251.671415 423.299819 251.671415 423.299819zM251.671415 423.299819" p-id="5407"></path></svg></el-icon>
                  <el-icon v-else><svg t="1649587589060" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2238" width="200" height="200"><path d="M832 364.8h-147.2s19.2-64 32-179.2c6.4-57.6-38.4-115.2-102.4-121.6h-12.8c-51.2 0-83.2 32-102.4 76.8l-38.4 96c-32 64-57.6 102.4-76.8 115.2-25.6 12.8-121.6 12.8-128 12.8H128c-38.4 0-64 25.6-64 57.6v480c0 32 25.6 57.6 64 57.6h646.4c96 0 121.6-64 134.4-153.6l51.2-307.2c6.4-70.4-6.4-134.4-128-134.4z m-576 537.6H128V422.4h128v480z m640-409.6l-51.2 307.2c-12.8 57.6-12.8 102.4-76.8 102.4H320V422.4c44.8 0 70.4-6.4 89.6-19.2 32-12.8 64-64 108.8-147.2 25.6-64 38.4-96 44.8-102.4 6.4-19.2 19.2-32 44.8-32h6.4c32 0 44.8 32 44.8 51.2-12.8 102.4-32 166.4-32 166.4l-25.6 83.2h243.2c19.2 0 32 0 44.8 12.8 12.8 12.8 6.4 38.4 6.4 57.6z" p-id="2239"></path></svg></el-icon>
                  {{ reply.likeCount }}
                </el-space>
                <div class="text-button" @click="onPrepareReply(index,reply.user)">回复</div>
                <el-popover class="more" v-if="reply.user.id === userStore.userInfo?.id" trigger="click" :width="64" placement="bottom-start">
                  <template #reference>
                    <el-icon class="text-button"><svg t="1649588331143" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3176" width="200" height="200"><path d="M243.2 512m-83.2 0a1.3 1.3 0 1 0 166.4 0 1.3 1.3 0 1 0-166.4 0Z" p-id="3177"></path><path d="M512 512m-83.2 0a1.3 1.3 0 1 0 166.4 0 1.3 1.3 0 1 0-166.4 0Z" p-id="3178"></path><path d="M780.8 512m-83.2 0a1.3 1.3 0 1 0 166.4 0 1.3 1.3 0 1 0-166.4 0Z" p-id="3179"></path></svg></el-icon>
                  </template>
                  <div class="more-item" @click="onDeleteReply(index, rIndex)">删除</div>
                </el-popover>
              </el-space>
            </div>
          </div>
          <el-pagination layout="prev, pager, next" hide-on-single-page :page-size="6" v-model:current-page="comment.page" :total="comment.replyPage.total" @current-change="onListReply(comment)" />
          <div v-if="replyIndex === index" class="comment-publish-main">
            <el-input type="textarea" :placeholder="toUser?.id === userStore.userInfo.id ? '' : `回复 @${toUser?.nickname}: `" v-model="replyContent" />
            <el-button class="comment-publish-buttom" @click="onReply">回复</el-button>
          </div>
        </div>
      </div>
      <el-pagination layout="prev, pager, next" hide-on-single-page :page-size="20" v-model:current-page="page" :total="commentList?.total" />
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
.comment-view {
  min-height: 100vh;
  padding: 32px 0;
  box-sizing: border-box;
  background-color: #f6f7f9;
}

.comment-main {
  min-width: 512px;
  max-width: 80%;
  padding: 16px 32px;
  margin: auto;
  background-color: #fff;
}

.title {
  margin: 16px 0;
  font-size: 18px;
  font-weight: 700;
}

.comment-header-btn {
  color: #61666d;
  text-decoration: none;
  cursor: pointer;
}

.sort-active {
  color: var(--text-color-active);
}

.comment-publish {
  display: flex;
}

.comment-publish-avatar {
  padding: 8px;
}

.comment-publish-main {
  flex: 1;
  display: flex;
  padding: 8px;
}

.comment-publish-buttom {
  height: 100%;
  margin-left: 8px;
}

.commnet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.comment-item {
  display: flex;
}

.comment-item-avatar {
  padding: 8px;
  cursor: pointer;
}

.comment-item-main {
  flex: 1;
  padding: 8px;
  border-bottom: 1px solid #e3e5e7;
}

.reply-item-main {
  flex: 1;
  padding: 8px;
}

.comment-user-nickname {
  cursor: pointer;
}

.comment-user-nickname:hover {
  color: var(--text-color-active);
}

.comment-content {
  margin: 8px 0;
}

.comment-info {
  color: #9499A0;
  font-size: 12px;
}

.text-button {
  cursor: pointer;
}

.like-active {
  color: var(--text-color-active);
}

.text-button:hover {
  color: #00a1d6;
}

.more-item {
  padding: 8px 16px;
  cursor: pointer;
}

.more-item:hover {
  color: #00aeec;
  background-color: #f1f2f3;
}
</style>
