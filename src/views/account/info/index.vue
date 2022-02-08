<script setup lang="ts">
import { useUserStore } from '@/store';
import { reactive, ref } from 'vue';

interface Info {
  nickname: string;
  profile: string;
}

const userStore = useUserStore();

const form = ref<Info>({
  nickname: userStore.userInfo?.nickname || '',
  profile: '',
});

const rules = reactive({
  nickname: [
    {
      required: true,
      message: '昵称不能为空',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 32,
      message: '长度必须在1到32之间',
      trigger: 'blur',
    },
  ]
});

const loading = ref<boolean>(false);

const onSave = () => {

};
</script>

<template>
  <el-form ref="formRef" :model="form" :rules="rules">
    <el-form-item prop="nickname" label="昵称">
      <el-input v-model="form.nickname" placeholder="昵称" />
    </el-form-item>
    <el-form-item label="用户名">
      <el-input :placeholder="userStore.userInfo?.username" disabled />
    </el-form-item>
    <el-form-item prop="profile" label="简介">
      <el-input type="textarea" v-model="form.profile" placeholder="简介" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSave" :loading="loading">保存</el-button>
    </el-form-item>
  </el-form>
</template>
