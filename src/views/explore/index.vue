<script setup lang="ts">
import NoteList from './components/NoteList.vue';
import TagBox from './components/TagBox.vue';
</script>

<template>
  <div class="explore-container">
    <div class="left-box">
      <NoteList />
    </div>
    <el-affix :offset="48">
      <div class="right-box">
        <TagBox />
      </div>
    </el-affix>
  </div>
</template>

<style scoped>
.explore-container {
  display: flex;
  min-height: calc(100% - 48px);
  padding: 0 80px;
  background-color: #f6f6f6;
}

.left-box {
  flex: 1;
  padding: 16px;
}

.right-box {
  width: 256px;
  padding: 16px;
}
</style>
