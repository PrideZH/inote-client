<script setup lang="ts">
import { addNote } from '@/api/note';
import { useNoteStore } from '@/store';
import { ref } from 'vue';

const noteStore = useNoteStore();

const __formDefault = { name: '', folderId: 0 };
const form = ref<{
  name: string,
  folderId: number
}>({...__formDefault});

const visible = ref<boolean>(false);
const loading = ref<boolean>(false);

const onConfirm = () => {
  loading.value = true;
  addNote(form.value).then(res => {
    noteStore.addNote(res.data);
    loading.value = false;
    visible.value = false;
  }).catch(err => {
    loading.value = false;
  });
};

const open = (folderId: number) => {
  form.value = {...__formDefault};
  form.value.folderId = folderId;
  visible.value = true;
};
defineExpose({ open });
</script>

<template>
  <el-dialog v-model="visible" title="添加笔记">
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
