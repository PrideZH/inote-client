<script setup lang="ts">
defineProps({
  content: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <span>
    <el-tooltip :disabled="content === ''" placement="top" :content="content">
      <span class="icon-btn">
        <slot />
      </span>
    </el-tooltip>
  </span>
</template>

<style scoped>
.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: #555;
  cursor: pointer;
}

.icon-btn:hover {
  background-color: #f0f0f0;
}
</style>
