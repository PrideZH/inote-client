<script setup lang="ts">
import Vditor from 'vditor';
import { onMounted, ref, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { diff_match_patch } from '@/utils/diff_match_patch';

const route = useRoute();
const router = useRouter();

// 网页参数
const noteId: number = Number(route.params.id);

const diff = ref<any[] | null>(null);
let isAlter: boolean = false;

const collapse = ref<boolean>(false); // 是否展开文件对比
const getContent = () => {
  collapse.value = true;
  nextTick(() => {
    if (diff.value != null) {
      for (let i = 0; i < diff.value.length; i++) {
        if (diff.value[i][0] !== 0) isAlter = true;
        const preview: HTMLElement | null = document.getElementById('preview' + i);
        Vditor.preview(preview as HTMLDivElement, diff.value[i][1]);
      }
    }
  });
}

onMounted(() => {
  if (isNaN(noteId)) {
    router.replace('/explore/404')
  }

  const dmp = new (diff_match_patch as any)();
});
</script>

<template>
  <el-collapse>
    <el-collapse-item title="详细修改内容信息" @click.once="getContent">
      <div v-if="collapse">
        <div
          :class="{ preview: true, delete: item[0] === -1, equal: item[0] === 0, insert: item[0] === 1 }"
          :id="'preview' + index"
          v-for="(item, index) in diff" :key="index"
        >
          {{ 'preview' + index }}
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped>
.preview {
  padding: 4px 32px;
}

.delete {
  background-color: #ffdddd
}

.insert {
  background-color: #ccffdd;
}
</style>
