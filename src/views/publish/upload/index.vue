<script setup lang="ts">
import { articleApi, noteApi } from '@/api';
import Vditor from 'vditor';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 网页参数
const type: 'add' | 'edit' = 'add'; // 默认为发布
const noteId: number = Number(route.params.id); // 传入笔记ID进行发布
const article: number = 0; // 输入文章ID进行编辑

const form = reactive<{
  id: number | null,
  noteId: number | null,
  title: string,
  summary: string,
  coverUrl: string | null,
}>({
  id: null,
  noteId: null,
  title: '',
  summary: '',
  coverUrl: null,
});
const noteContent = ref<string>('');
const articleContent = ref<string>('');
const loading = ref<boolean>(false);

const onClick = () => {

}

const getContent = () => {
  const preview: HTMLElement | null = document.getElementById('preview');
  if (preview !== null) {
    Vditor.preview(preview as HTMLDivElement, noteContent.value);
  }
}

onMounted(() => {
  if (isNaN(noteId)) {
    router.replace('/explore/404')
  }
  noteApi.get(noteId).then(res => {
    form.noteId = res.data.id;
    form.title = res.data.name;
    noteContent.value = res.data.content;
  }).catch(err => {
    console.log(err);
  });
});
</script>

<template>
  <h2>基本信息</h2>
  <el-form ref="formRef" :model="form">
    <el-form-item prop="coverUrl" label="封面">
    </el-form-item>
    <el-form-item label="标题">
      <el-input v-model="form.title" placeholder="标题" />
    </el-form-item>
    <el-form-item prop="summary" label="简介">
      <el-input type="textarea" v-model="form.summary" placeholder="简介" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onClick" :loading="loading">上传</el-button>
    </el-form-item>
  </el-form>
  <el-collapse>
    <el-collapse-item title="详细修改内容信息" @click.once="getContent">
      <div id="preview" />
    </el-collapse-item>
  </el-collapse>
</template>
