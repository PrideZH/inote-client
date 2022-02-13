<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
const top = ref(0);
const left = ref(0);
const data = ref();

// 超出底部的偏移量调制
const offset = 48;

const open = (event: MouseEvent, _data: any) => {
  data.value = _data;
  left.value = event.clientX;
  if (event.clientY + offset > document.documentElement.clientHeight) {
    top.value = document.documentElement.clientHeight - offset;
  } else {
    top.value = event.clientY;
  }
  visible.value = true;
};
defineExpose({ open });
</script>

<template>
  <div v-if="visible" class="mask" @mousedown="visible = false" @contextmenu="visible = false" />
  <div
    v-if="visible"
    class="contextmenu-dropdown"
    :style="{ left: left + 'px', top: top + 'px' }"
    @click="visible = false"
  >
    <slot :data="data" />
  </div>
</template>

<style scoped>
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.contextmenu-dropdown {
  position: absolute;
  z-index: 1001;
  padding: 4px 0;
  border: 1px solid #e4e7ed;
  background-color: #fff;
  animation: fadeIn 0.083s linear;
}
</style>
