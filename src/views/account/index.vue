<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

let activeIndex = ref<string>(route.path);

const accountMenuitems = [
  { index: '/account/home', locale: '首页' },
  { index: '/account/info', locale: '我的信息' },
  { index: '/account/avatar', locale: '我的头像' },
  { index: '/account/security', locale: '账号安全' }
];

const title = computed(() => {
  for (let i = 0; i < accountMenuitems.length; i++) {
    for (let i = 0; i < accountMenuitems.length; i++) {
      if (accountMenuitems[i].index === activeIndex.value) return accountMenuitems[i].locale;
    }
  }
})

const onSelect = (index: string) => activeIndex.value = index;
</script>

<template>
  <div class="account-container">
    <el-menu :default-active="activeIndex" router @select="onSelect">
      <el-menu-item v-for="item in accountMenuitems" :index="item.index">{{ item.locale }}</el-menu-item>
    </el-menu>
    <div class="account-content">
      <div class="account-header">{{ title }}</div>
      <router-view class="account-main" />
    </div>
  </div>
</template>

<style scoped>
.account-container {
  display: flex;
  padding: 0 160px;
  box-sizing: border-box;
}

.account-header {
  height: 40px;
  padding: 0 32px;
  line-height: 40px;
  border-bottom: 1px solid #eee;
}

.account-content {
  flex: 1;
}

.account-main {
  padding: 40px;
}
</style>
