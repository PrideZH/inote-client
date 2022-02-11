<script setup lang="ts">
import { noteApi } from '@/api';
import router from '@/router';
import { NotePage, Page } from '@/types';
import { ref } from 'vue';

const noteList = ref<Page<NotePage>>();

noteApi.getList(10, 1).then(res => noteList.value = res.data);
</script>

<template>
  <el-table :data="noteList?.records">
    <el-table-column label="ID" width="120">
      <template #default="scope">
        <span>inote_{{ scope.row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="createTime" label="创建时间" />
    <el-table-column prop="updateTime" label="更新时间" />
    <el-table-column fixed="right" label="文章">
      <template #default="scope">
        <el-button type="text" style="color: #909399">{{ scope.row.article }}</el-button>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button type="text" size="small" @click="router.push(`/publish/upload/${scope.row.id}`)">发布</el-button>
        <el-button type="text" size="small">更多</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
