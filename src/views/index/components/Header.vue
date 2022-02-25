<script setup lang="ts">
import { useAppStore, useNoteStore } from '@/store';
import { ArrowRight, FullScreen, Minus } from '@element-plus/icons-vue'
import IconBtn from '@/components/IconBtn.vue';

const appStore = useAppStore();
const noteStore = useNoteStore();
</script>

<template>
  <div class="header">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item v-for=" note in noteStore.currentNotes" :key="note.id">
        <a :class="{'unsave': noteStore.currentNote === note && noteStore.isAlter}" @click="noteStore.push(note)">
          {{ note.name }}
        </a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <IconBtn v-if="noteStore.currentNote !== null" @click="appStore.fullscreen = !appStore.fullscreen">
        <el-icon>
          <FullScreen v-if="!appStore.fullscreen"/>
          <Minus v-else />
        </el-icon>
      </IconBtn>
    </div>
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

.unsave {
  color: #f75353 !important;
}
</style>
