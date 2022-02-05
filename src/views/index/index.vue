<script setup lang="ts">
import Vditor from 'vditor';
import { onMounted } from 'vue';

onMounted(() => {
  new Vditor('editor', {
    toolbar: [],
    cache: {
      enable: false // 关闭缓存
    }
  });
});
</script>

<template>
  <div id="editor" />
</template>

<style>
.vditor-toolbar {
  border: none;
}
</style>
<style scoped>
#editor {
  border: none;
}
</style>
