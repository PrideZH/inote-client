<script setup lang="ts">
import { tagApi } from '@/api';
import { TagPage } from '@/types';
import { onMounted, ref } from 'vue';
import Tag from '@/components/Tag.vue';

const tags = ref<TagPage[]>([]);
onMounted(() => tagApi.getList(100, 1).then(res => tags.value = res.data.records))
</script>

<template>
  <div class="tag-box">
    <div class="title">热门标签</div>
    <el-space wrap>
      <Tag class="tag-item" v-for="tag in tags">
        {{ tag.name }} <template v-if="tag.articleCount">{{ tag.articleCount }}</template>
      </Tag>
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
</style>
