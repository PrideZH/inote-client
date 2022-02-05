<script setup lang="ts">
import Header from './components/Header.vue';
</script>

<template>
  <el-affix>
    <Header />
  </el-affix>
  <router-view></router-view>
</template>
