<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useFolderStore } from '@/store';
import { setFolder } from '@/api/folder';
import { FolderTree } from '@/types';

const folderStore = useFolderStore();

const form = reactive<{
  id: number,
  name: string
}>({
  id: 0,
  name: '',
});

const visible = ref<boolean>(false);
const loading = ref<boolean>(false);

const onConfirm = () => {
  loading.value = true;
  setFolder(form.id, { name: form.name }).then(res => {
    folderStore.setFolderTree(form.id, res.data);
    loading.value = false;
    visible.value = false;
  }).catch(err => {
    loading.value = false;
  });
};

const open = (id: number) => {
  const folder: FolderTree | null = folderStore.getFolderById(id);
  console.log(folder)
  if (folder === null) return;
  form.id = folder.id as number;
  form.name = folder.name as string;
  visible.value = true;
};
defineExpose({ open });
</script>

<template>
  <el-dialog v-model="visible" title="添加文件夹">
    <el-form :model="form">
      <el-form-item label="文件夹名">
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
