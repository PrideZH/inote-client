<script setup lang="ts">
import { reactive, ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { setToken } from "@/utils/auth";
import { ElForm } from "element-plus";
import { userApi } from "@/api";

const router = useRouter();

const routerTo = (url: string) => {
  router.push(url);
};

const formRef = ref<InstanceType<typeof ElForm>>();

const form = reactive({
  username: '',
  password: '',
});

const rules = reactive({
  username: [
    {
      required: true,
      message: '请输入账号',
      trigger: 'blur',
    },
    {
      min: 8,
      max: 32,
      message: '长度必须在8到32之间',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
    {
      min: 8,
      max: 32,
      message: '长度必须在8到32之间',
      trigger: 'blur',
    },
  ]
});

const loginLoading = ref<boolean>(false);

const onLogin = () => {
  if (!formRef.value) return;
  formRef.value.validate((valid: boolean | undefined) => {
    if (valid) {
      loginLoading.value = true;
      userApi.login({username: form.username, password: form.password}).then(res => {
        loginLoading.value = false;
        setToken(res.data.token);
        routerTo('/index');
      }).catch(err => {
        loginLoading.value = false;
      });
    }
  });
};
</script>

<template>
  <div class="login-box">
    <el-form ref="formRef" :model="form" :rules="rules">
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="QQ邮箱" @keydown.enter="onLogin" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input show-password v-model="form.password" placeholder="密码" @keydown.enter="onLogin" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onLogin" :loading="loginLoading">登录</el-button>
        <el-button @click="routerTo('/register')">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.login-box {
  width: 512px;
  padding: 60px;
  margin: 120px auto;
  box-shadow: 0 0 18px 0 rgb(57 141 238 / 12%);
}
</style>
