<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
})
</script>

<template>
  <div id="outline">

  </div>
</template>

<style scoped>
#outline {
  height: calc(100vh - 88px);
  overflow-y: scroll;
  overflow-x: hidden;
}

#outline:hover {
  overflow-x: scroll;
}

#outline >>> .vditor-outline {
  width: fit-content;
}
</style>
