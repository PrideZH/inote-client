<script setup lang="ts">
import { useUserStore } from '@/store';
import { ElDivider } from 'element-plus';
import { h } from 'vue';

const userStore = useUserStore();
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
          <el-input />
          <el-button>发布</el-button>
        </div>
      </div>
      <div class="commnet-header">
        <div class="title">全部评论 1090</div>
        <el-space :spacer="h(ElDivider, { direction: 'vertical' })">
          <a class="comment-header-btn" href="#hot">最热</a>
          <a class="comment-header-btn" href="#newest">最新</a>
        </el-space>
      </div>
      <div class="comment-item">
        <div class="comment-item-avatar">
          <el-avatar>inote</el-avatar>
        </div>
        <div class="comment-item-main">
          <div class="comment-user-nickname">PrideZH</div>
          <div class="comment-content">test test test test test test test test test test test test test test test</div>
          <el-space class="comment-info">
            <div class="comment-time">2022-02-24 16:11</div>
            <div class="like">1006</div>
            <div>回复</div>
          </el-space>
          <div class="comment-reply">

          </div>
        </div>
      </div>
      <div class="comment-item">
        <div class="comment-item-avatar">
          <el-avatar>inote</el-avatar>
        </div>
        <div class="comment-item-main">
          <div class="comment-user-nickname">PrideZH</div>
          <div class="comment-content">test test test test test test test test test test test test test test test</div>
          <el-space class="comment-info">
            <div class="comment-time">2022-02-24 16:11</div>
            <div class="like">1006</div>
            <div>回复</div>
          </el-space>
          <div class="comment-reply">

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-view {
  min-height: 100vh;
  padding: 32px 160px;
  box-sizing: border-box;
  background-color: #f6f7f9;
}

.comment-main {
  padding: 16px 32px;
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
}

.comment-publish {
  display: flex;
}

.comment-publish-avatar {
  padding: 8px;
}

.comment-publish-main {
  flex: 1;
  padding: 8px;
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

.comment-user-nickname {
  cursor: pointer;
}

.comment-content {
  margin: 8px 0;
}

.comment-info {
  color: #9499A0;
  font-size: 12px;
}
</style>
