<script setup lang="ts">
import { addFolder } from '@/api/folder';
import { useFolderStore } from '@/store';
import { ref } from 'vue';

const folderStore = useFolderStore();

const __formDefault = { name: '', parentId: 0 };
const form = ref<{
  name: string,
  parentId: number
}>({...__formDefault});

const visible = ref<boolean>(false);
const loading = ref<boolean>(false);

const onConfirm = () => {
  loading.value = true;
  addFolder(form.value).then(res => {
    folderStore.addFolderTree(res.data, form.value.parentId);
    loading.value = false;
    visible.value = false;
  }).catch(err => {
    loading.value = false;
  });
};

const open = (parentId: number) => {
  form.value = {...__formDefault};
  form.value.parentId = parentId;
  visible.value = true;
};
defineExpose({ open });
</script>

<template>
  <el-dialog v-model="visible" title="添加文件夹">
    <el-form :model="form">
      <el-form-item label="文件夹名">
        <el-input v-model="form.name" />
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
