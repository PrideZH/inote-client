<script setup lang="ts">
import { PicbedConfig } from '@/types/global';
import Gitee, { GiteeImg } from '@/utils/gitee';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import Contextmenu from '@/components/Contextmenu.vue';
import ContextmenuItem from '@/components/ContextmenuItem.vue';
import IconBtn from '@/components/IconBtn.vue';
import { Plus } from '@element-plus/icons-vue';
import ContextmenuDivided from '@/components/ContextmenuDivided.vue';
import useClipboard from 'vue-clipboard3';
import { StringUtil } from '@/utils/StringUtil';

const contextMenuRef = ref();

const { toClipboard } = useClipboard()

const configJson: string | null = localStorage.getItem('picbed');
const picbedConfig = ref<PicbedConfig | null>(configJson ? JSON.parse(configJson) : null);
const images = ref<GiteeImg[]>();

const onClickNode = (node: GiteeImg) => {
  emits('node-click', node);
}

const onContextmenu = (event: MouseEvent, node: GiteeImg) => {
  contextMenuRef.value.open(event, node);
};

const copyLink = async (node: GiteeImg) => {
  try {
    await toClipboard(`![${node.name}](${node.imgUrl})`);
    ElMessage.success('复制成功');
  } catch (e) {
    ElMessage.error('复制失败: ' + e);
  }
}

const deleteImg = (node: GiteeImg) => {
  if (picbedConfig.value === null) {
    ElMessage.warning('未配置图床，请到“设置”中配置');
    return;
  }
  Gitee.delImg(picbedConfig.value.owner, picbedConfig.value.repo, node.path,
      { access_token: picbedConfig.value.accessToken, sha: node.sha, message: 'inote delete' }).then(res => {
    if (images.value) {
      for (let i = 0; i < images.value.length; i++) {
        if (images.value[i] === node) {
          images.value.splice(i, 1);
          break;
        }
      }
    }
    ElMessage.success('删除成功');
  });
}

onMounted(() => {
  if (picbedConfig.value === null
      || StringUtil.isOrBlank(
        picbedConfig.value.owner,
        picbedConfig.value.repo,
        picbedConfig.value.path,
        picbedConfig.value.accessToken)
  ) {
    ElMessage.warning('未配置图床，请到“设置”中配置');
    return;
  }
  Gitee.getJpgs(picbedConfig.value.owner, picbedConfig.value.repo, picbedConfig.value.path,
      { access_token: picbedConfig.value.accessToken }).then(res => {
    images.value = res;
  }).catch(err => {
    ElMessage.error('图床配置错误');
  });
});

const emits = defineEmits(['node-click']);
</script>

<template>
  <div class="img-dir-view">
    <div class="dir-tool">
      <el-input size="small" />
      <IconBtn><el-icon><Plus /></el-icon></IconBtn>
    </div>
    <div class="tree-scroll">
      <el-tree
        class="img-tree"
        :data="images"
        :props="{ label: 'name' }"
        node-key="name"
        @node-click="onClickNode"
        @node-contextmenu="onContextmenu"
      />
    </div>
  </div>

  <Contextmenu ref="contextMenuRef">
    <template #default="{ data }">
      <ContextmenuItem @click="copyLink(data)">复制链接</ContextmenuItem>
      <ContextmenuDivided />
      <ContextmenuItem @click="deleteImg(data)">删除图片</ContextmenuItem>
    </template>
  </Contextmenu>
</template>

<style scoped>
.img-dir-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fafafa;
}

.dir-tool {
  display: flex;
  align-items: center;
  padding: 4px 8px;
}

.tree-scroll {
  flex: 1;
  display: flex;
  overflow-x: hidden;
  overflow-y: scroll;
}

.tree-scroll:hover {
  overflow-x: scroll;
}

.img-tree {
  flex: 1;
  background-color: #fafafa;
}
</style>
