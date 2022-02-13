<template>
  <div class="context-menu-item">
    <slot />
  </div>
</template>

<style scoped>
.context-menu-item {
  padding: 4px 32px;
  cursor: pointer;
  color: #606266;
  font-size: 14px;
}

.context-menu-item:hover {
  background-color: #ecf5ff;
}
</style>
