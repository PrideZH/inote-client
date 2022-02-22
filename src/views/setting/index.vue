<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

let activeIndex = ref<string>(route.path);

const settingMenuitems = [
  { index: '/index/setting/picbed', locale: '图床设置' },
];

const title = computed(() => {
  for (let i = 0; i < settingMenuitems.length; i++) {
    for (let i = 0; i < settingMenuitems.length; i++) {
      if (settingMenuitems[i].index === activeIndex.value) return settingMenuitems[i].locale;
    }
  }
})

const onSelect = (index: string) => activeIndex.value = index;
</script>

<template>
  <div class="setting-container">
    <el-menu :default-active="activeIndex" router @select="onSelect">
      <el-menu-item v-for="item in settingMenuitems" :index="item.index">{{ item.locale }}</el-menu-item>
    </el-menu>
    <div class="setting-content">
      <div class="setting-header">{{ title }}</div>
      <router-view class="setting-main" />
    </div>
  </div>
</template>

<style scoped>
.setting-container {
  flex: 1;
  display: flex;
  box-sizing: border-box;
}

.setting-header {
  height: 40px;
  padding: 0 32px;
  line-height: 40px;
  border-bottom: 1px solid #eee;
}

.setting-content {
  flex: 1;
}

.setting-main {
  padding: 40px;
}
</style>
