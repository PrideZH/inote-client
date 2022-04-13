<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

let activeIndex = ref<string>(route.path);

const menuitems = [
  { index: '/message/reply', locale: '回复我的' },
  { index: '/message/system', locale: '系统通知' },
  { index: '/message/whisper', locale: '我的消息' }
];

const onSelect = (index: string) => activeIndex.value = index;
</script>

<template>
  <div class="container">
    <el-menu class="menu" :default-active="activeIndex" router @select="onSelect">
      <el-menu-item v-for="item in menuitems" :index="item.index">{{ item.locale }}</el-menu-item>
    </el-menu>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.container {
  height: calc(100% - 48px);
  display: flex;
}

.menu {
  width: 128px;
}

.content {
  flex: 1;
  padding: 32px;
  min-width: 180px;
}
</style>
