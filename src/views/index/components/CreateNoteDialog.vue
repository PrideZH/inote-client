<script setup lang="ts">
import { noteApi } from '@/api';
import { DirectoryNode } from '@/types';
import { ref } from 'vue';

const __formDefault = { name: '', folderId: 0 };
const form = ref<{
  name: string,
  folderId: number
}>({...__formDefault});

const visible = ref<boolean>(false);
const loading = ref<boolean>(false);

// 成功回调函数
let OkCallBack: ((node: DirectoryNode) => {}) | null = null;

const onConfirm = () => {
  loading.value = true;

  noteApi.add(form.value).then(res => {
    visible.value = false;
    loading.value = false;
    if (OkCallBack !== null) {
      OkCallBack(res.data);
    }
  }).catch(err => {
    loading.value = false;
  });
};

const open = (folderId: number, _OkCallBack: ((node: DirectoryNode) => {}) | null = null) => {
  OkCallBack = _OkCallBack;
  form.value = {...__formDefault};
  form.value.folderId = folderId;
  visible.value = true;
};
defineExpose({ open });
</script>

<template>
  <el-dialog v-model="visible" title="新建笔记">
    <el-form :model="form">
      <el-form-item label="笔记名">
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
