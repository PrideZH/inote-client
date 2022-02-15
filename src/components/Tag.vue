<template>
  <span class="tag-item">
    <slot />
  </span>
</template>

<style scoped>
.tag-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
  color: rgba(0, 0, 0, .44);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.6s ease;
}

.tag-item:hover {
  color: #fff;
  background-color: #1b1b1b;
}
</style>
