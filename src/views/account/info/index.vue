<script setup lang="ts">
import { userApi } from '@/api';
import { useUserStore } from '@/store';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';

interface Info {
  nickname: string;
  profile: string;
}

const userStore = useUserStore();

const formRef = ref();

const form = reactive<Info>({
  nickname: '',
  profile: ''
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
  if (!formRef.value) return;
  formRef.value.validate((valid: boolean | undefined) => {
    if (valid && userStore.userInfo) {
      userApi.updateUser(userStore.userInfo.id, { nickname: form.nickname }).then(res => {
        userStore.userInfo = res.data;
        ElMessage.success('修改成功');
      });
    }
  });
}

onMounted(() => {
  userApi.getUserInfo().then(res => {
    userStore.userInfo = res.data;
    form.nickname = res.data.nickname;
    // TODO: 简介
  });
});
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
