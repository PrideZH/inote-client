<script setup lang="ts">
import { reactive, ref } from 'vue';
import { folderApi, noteApi } from '@/api';
import { DirectoryNode } from '@/types';

const form = reactive<{
  id: number;
  name: string;
  note: boolean;
}>({
  id: 0,
  name: '',
  note: false
});

const visible = ref<boolean>(false);
const loading = ref<boolean>(false);

// 成功回调函数
let OkCallBack: ((node: DirectoryNode) => {}) | null = null;

const onConfirm = () => {
  loading.value = true;
  if (form.note) {
    folderApi.setRelevance(form.id, { name: form.name }).then(res => {
      loading.value = false;
      visible.value = false;
      if (OkCallBack !== null) {
        OkCallBack(res.data);
      }
    }).catch(err => {
      loading.value = false;
    });
  } else {
    folderApi.set(form.id, { name: form.name }).then(res => {
      loading.value = false;
      visible.value = false;
      if (OkCallBack !== null) {
        OkCallBack(res.data);
      }
    }).catch(err => {
      loading.value = false;
    });
  }
};

const open = (dir: DirectoryNode, _OkCallBack: ((node: DirectoryNode) => {}) | null = null) => {
  OkCallBack = _OkCallBack;
  form.id = dir.id;
  form.name = dir.name;
  form.note = dir.note;
  visible.value = true;
};
defineExpose({ open });
</script>

<template>
  <el-dialog v-model="visible" title="重命名">
    <el-form :model="form">
      <el-form-item prop="name" label="文件名称">
        <el-input v-model="form.name" @keydown.enter.prevent="onConfirm" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
