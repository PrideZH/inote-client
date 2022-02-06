<script setup lang="ts">
const tags = ['Java', 'C++', 'C#', 'Spirng', 'Javascript', 'Go', 'Vue', 'TypeScript']
</script>

<template>
  <div class="tag-box">
    <div class="title">热门标签</div>
    <el-space wrap>
      <span class="tag-item" v-for="tag in tags">
        {{ tag }}
      </span>
    </el-space>
  </div>
</template>

<style scoped>
.tag-box {
  padding: 24px;
  margin: 16px 0;
  background-color: #fff;
  box-shadow: 0 5px 15px 0 rgb(146 146 146 / 6%);
}

.title {
  padding-bottom: 16px;
  border-bottom: 2px solid #282828;
  margin-bottom: 16px;
  font-size: 18px;
  color: #282828;
  font-weight: 600;
}

.tag-item {
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
