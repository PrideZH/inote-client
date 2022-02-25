<script setup lang="ts">
import { noteApi } from '@/api';
import router from '@/router';
import { NotePage, Page } from '@/types';
import { onMounted, ref } from 'vue';

const noteList = ref<Page<NotePage>>();

const currentPage = ref<number>(1);
const pageSize = ref<number>(10);

const getNoteList = () => {
  noteApi.getList(pageSize.value, currentPage.value).then(res => noteList.value = res.data);
}

onMounted(() => {
  getNoteList();
});
</script>

<template>
  <div class="table-view">
    <el-table height="calc(100% - 96px)" :data="noteList?.records">
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
          <el-button v-else type="text" size="small" @click="router.push(`/publish/article/${scope.row.article.id}`)">
            {{ scope.row.article.title }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button style="color: #f56c6c;" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="table-pagination"
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="noteList?.total"
      @size-change="getNoteList"
      @current-change="getNoteList"
    />
  </div>
</template>

<style scoped>
.table-view {
  height: 100%;
}

.table-pagination {
  float: right;
  margin-top: 32px;
}
</style>
