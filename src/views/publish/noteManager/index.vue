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
    <el-table-column label="关联文件夹" align="center">
      <template #default="scope">
        <el-button type="text" size="small">0</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" />
    <el-table-column prop="updateTime" label="更新时间" />
    <el-table-column label="文章状态" align="center">
      <template #default="scope">
        <el-button
          v-if="scope.row.article === null"
          style="color: #909399;"
          type="text" size="small"
          @click="router.push(`/publish/upload/${scope.row.id}`)"
        >
          未发布
        </el-button>
        <el-button v-else type="text" size="small">查看</el-button>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button style="color: #f56c6c;" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
