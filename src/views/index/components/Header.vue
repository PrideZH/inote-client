<script setup lang="ts">
import { useNoteStore } from '@/store';
import { ArrowRight } from '@element-plus/icons-vue'

const noteStore = useNoteStore();
</script>

<template>
  <div class="header">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item v-for=" note in noteStore.currentNotes" :key="note.id">
        <a @click="noteStore.push(note)">{{ note.name }}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <span class="info-text" v-if="noteStore.currentNote !== null">
      LUD: {{ noteStore.currentNote.updateTime }}
      NID: {{ noteStore.currentNote.name }}_inote_{{ noteStore.currentNote.id }}
      <el-button type="primary" size="small">发布</el-button>
    </span>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
  padding: 0 32px;
  white-space: nowrap;
}

.info-text {
  font-size: 8px;
  color: #777;
}
</style>
