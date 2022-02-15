<script setup lang="ts">
import { PicbedConfig } from '@/types/global';
import Gitee, { GiteeImg } from '@/utils/gitee';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

const gitee = new Gitee();

const configJson: string | null = localStorage.getItem('picbed');
const picbedConfig = ref<PicbedConfig | null>(configJson ? JSON.parse(configJson) : null);
const images = ref<GiteeImg[]>();

const onClickNode = (node: GiteeImg) => {
  emits('node-click', node);
}

onMounted(() => {
  if (picbedConfig.value === null) {
    ElMessage.warning('未配置图床，请到“设置”中配置');
    return;
  }
  gitee.getJpgs(picbedConfig.value.owner, picbedConfig.value.repo, picbedConfig.value.path,
      { access_token: picbedConfig.value.accessToken }).then(res => {
    images.value = res;
  })
});

const emits = defineEmits(['node-click']);
</script>

<template>
  <el-tree
    class="img-tree"
    :data="images"
    :props="{ label: 'name' }"
    node-key="name"
    @node-click="onClickNode"
  />
</template>

<style scoped>
.img-tree {
  height: 100%;
  width: 100%;
  overflow: scroll;
}
</style>
