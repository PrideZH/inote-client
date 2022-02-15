<script setup lang="ts">
import { articleApi } from '@/api';
import router from '@/router';
import { ArticleInfoPage, Page } from '@/types';
import { ref } from 'vue';

const articleList = ref<Page<ArticleInfoPage>>();

articleApi.getListMe(1, 10).then(res => articleList.value = res.data);
</script>

<template>
  <el-table :data="articleList?.records">
    <el-table-column prop="id" label="ID" width="120" />
    <el-table-column prop="title" label="标题" />
    <el-table-column prop="createTime" label="创建时间" />
    <el-table-column prop="updateTime" label="更新时间" />
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button type="text" size="small" @click="router.push(`/publish/article/${scope.row.id}`)">查看</el-button>
        <el-button type="text" size="small" @click="router.push(`/publish/upload/${scope.row.noteId}`)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
