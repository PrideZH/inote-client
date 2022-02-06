<script setup lang="ts">
import { useNoteStore } from '@/store';
import { ArrowRight } from '@element-plus/icons-vue'
import { computed } from 'vue';

const noteStore = useNoteStore();
const lastNote = computed(() => noteStore.currentNote[noteStore.currentNote.length - 1]);
</script>

<template>
  <div class="header">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item v-for=" note in noteStore.currentNote" :key="note.id">{{ note.name }}</el-breadcrumb-item>
    </el-breadcrumb>
    <span class="info-text" v-if="noteStore.currentNote.length !== 0">
      LUD: {{ lastNote.updateTime }}
      NID: {{ lastNote.name }}_inote_{{ lastNote.id }}
    </span>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}

.info-text {
  font-size: 8px;
  color: #777;
}
</style>
