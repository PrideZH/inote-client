<script setup lang="ts">
import { reactive, ref } from 'vue';
import { DirectoryNode, NotePage, Page } from '@/types';
import { folderApi, noteApi } from '@/api';

const addNotes = ref<NotePage[]>();

const checkboxNotes = ref<NotePage[]>([]);
const visible = ref<boolean>(false);
const loading = ref<boolean>(false);

const form = reactive<{
  parentId: number;
}>({
  parentId: 0
});

// 成功回调函数
let OkCallBack: ((node: DirectoryNode) => {}) | null = null;

const onConfirm = () => {
  if (checkboxNotes.value.length === 0) return;
  loading.value = true;
  const note = checkboxNotes.value[0];
  folderApi.addRelevance({ name: note.name, noteId: note.id, folderId: form.parentId }).then(res => {
    loading.value = false;
    visible.value = false;
    if (OkCallBack != null) {
      OkCallBack(res.data);
    }
  }).catch(err => {
    loading.value = false;
  });
};

const open = (parentId: number, _OkCallBack: ((node: DirectoryNode) => {}) | null = null) => {
  OkCallBack = _OkCallBack;
  form.parentId = parentId;
  visible.value = true;

  folderApi.getDirectory(parentId).then(res => {
    const dir: DirectoryNode[] = res.data;
    noteApi.getList(100, 1).then(res => {
      // 排除已存在笔记 不需要添加
      let currentNoteIds = dir.map((item: DirectoryNode) => {
        if (item.note) {
          return item.noteId;
        }
      });
      const notes: NotePage[] = res.data.records;
      addNotes.value = notes.filter(note => !currentNoteIds.includes(note.id));
    });
  });

};
defineExpose({ open });
</script>

<template>
  <el-dialog v-model="visible" title="添加笔记">
    <el-checkbox-group v-model="checkboxNotes" :max="1">
      <el-checkbox v-for="note in addNotes" :key="note.id" :label="note">
        {{ note.name }} | inote_{{ note.id }}
      </el-checkbox>
  </el-checkbox-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
