<script setup lang="ts">
import { useAppStore } from '@/store';

import IndexMobile from './IndexMobile.vue';
import IndexPc from './IndexPc.vue';

const appStore = useAppStore();
</script>

<template>
  <!-- <IndexMobile v-if="appStore.isMobile" />
  <IndexPc v-else /> -->
  <IndexPc />
</template>
