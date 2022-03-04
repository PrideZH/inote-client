<script setup lang="ts">
import DirectoryMobile from './components/directory/DirectoryMobile.vue';
</script>

<template>
  <DirectoryMobile @click-leaf="$router.push('/index/edit')" />
  <div class="note-tool">

  </div>
</template>

<style scoped>
.note-tool {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #eee;
}

.save-icon {
  color: #f75353;
}
</style>
