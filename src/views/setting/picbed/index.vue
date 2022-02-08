<script setup lang="ts">
import { PicbedConfig } from '@/types/global';
import { ElMessage } from 'element-plus';
import { reactive } from 'vue';

const configJson: string | null = localStorage.getItem('picbed');
const picbedConfig = reactive<PicbedConfig>(configJson ? JSON.parse(configJson) : {
  owner: '',
  repo: '',
  path: '',
  accessToken: ''
});

const handleSave = (): void => {
  localStorage.setItem('picbed', JSON.stringify(picbedConfig));
  ElMessage.success('保存成功');
};
</script>

<template>
  <el-form :model="picbedConfig">
    <el-form-item props="owner" label="Gitee 账号名称">
      <el-input v-model="picbedConfig.owner" placeholder="张三" />
    </el-form-item>
    <el-form-item props="repo" label="Gitee 仓库名">
      <el-input v-model="picbedConfig.repo" placeholder="picbed" />
    </el-form-item>
    <el-form-item props="path" label="文件路径">
      <el-input v-model="picbedConfig.path" placeholder="images" />
    </el-form-item>
    <el-form-item props="accessToken" label="私人令牌">
      <el-input v-model="picbedConfig.accessToken" />
    </el-form-item>
    <el-form-item>
      <el-button @click="handleSave">保存</el-button>
    </el-form-item>
  </el-form>
</template>
