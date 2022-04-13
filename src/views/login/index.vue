<script setup lang="ts">
import { reactive, ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { setToken } from "@/utils/auth";
import { ElForm, ElMessage } from "element-plus";
import { userApi } from "@/api";
import { StringUtil } from "@/utils/StringUtil";

const router = useRouter();

const isLogin = ref<boolean>(true);

const routerTo = (url: string) => {
  router.push(url);
};

const __validateEmail = (rule: any, value: any, callback: any) => {
  const regEmail = /^([a-zA-Z0-9_-])+@qq.com+/;
  if(regEmail.test(value)){
    return callback();
  }
  callback(new Error('请输入合法的邮箱！'));
}

const __validatePasswordRepeat = (rule: any, value: any, callback: any) => {
  if (registerForm.password === registerForm.passwordRepeat) {
    return callback();
  }
  callback(new Error("密码不同"));
}

/**
 * 登录
 */
const formRef = ref<InstanceType<typeof ElForm>>();

const form = reactive({
  email: '',
  password: ''
});

const rules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur', },
    {validator: __validateEmail, trigger: 'blur'}
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 32, message: '长度必须在8到32之间', trigger: 'blur' },
  ]
});

const loginLoading = ref<boolean>(false);

const onLogin = () => {
  if (!formRef.value) return;
  formRef.value.validate((valid: boolean | undefined) => {
    if (valid) {
      loginLoading.value = true;
      userApi.login({username: form.email, password: form.password}).then(res => {
        setToken({ token: res.data.token, timeout: new Date().getTime() + res.data.timeout * 1000 });
        routerTo('/index');
        loginLoading.value = false;
      }).catch(err => {
        loginLoading.value = false;
      });
    }
  });
};

/**
 * 注册
 */
const registerFormRef = ref<InstanceType<typeof ElForm>>();
const registerLoading = ref<boolean>(false);

const registerForm = reactive({
  email: '',
  password: '',
  passwordRepeat: '',
  code: ''
});

const registerRules = reactive({
  email: [
    { required: true, message: '不能为空', trigger: 'blur' },
    {validator: __validateEmail, trigger: 'blur'}
  ],
  password: [
    { required: true, message: '不能为空', trigger: 'blur' },
    { min: 8, max: 16, message: '长度必须为8到16位', trigger: 'blur' }
  ],
  passwordRepeat: [
    { required: true, message: '不能为空', trigger: 'blur' },
    { min: 8, max: 16, message: '长度必须为8到16位', trigger: 'blur' },
    { validator: __validatePasswordRepeat, trigger: 'blur' }
  ]
});

const getCodeDisabled = ref<boolean>(false);
const intervalCnt = ref<number>(0);

let __timer: NodeJS.Timer;

const onRequestCode = () => {
  if (!registerFormRef.value) return;
  registerFormRef.value.validate((valid: boolean | undefined) => {
    if (valid) {
      userApi.getEmailCode({ email: registerForm.email }).then(() => {
        ElMessage.success('发送成功');
      });
      // 60s内禁止请求
      intervalCnt.value = 60;
      getCodeDisabled.value = true;
      __timer = setInterval(() => {
      intervalCnt.value--;
        if (intervalCnt.value <= 0) {
          getCodeDisabled.value = false;
          clearInterval(__timer);
        }
      }, 1000);
    }
  });
}

const onRegister = () => {
  if (!registerFormRef.value) return;
  registerFormRef.value.validate((valid: boolean | undefined) => {
    if (valid) {
      registerLoading.value = true;
      userApi.register({ username: registerForm.email, password: registerForm.password, code: registerForm.code }).then(res => {
        ElMessage.success('注册成功');
        isLogin.value = true;
        registerLoading.value = false;
      }).catch(err => {
        registerLoading.value = false;
      });
    }
  });
}
</script>

<template>
  <div class="container">
    <div class="container-form">
      <!-- 登录 -->
      <template v-if="isLogin">
        <div class="form-header">
          <div class="form-title">登录</div>
          <el-space class="form-info">没有账号? <el-button type="text" @click="isLogin = false">点击注册</el-button></el-space>
        </div>
        <el-form ref="formRef" :model="form" :rules="rules">
          <el-form-item prop="email">
            <el-input
              v-model="form.email"
              placeholder="QQ邮箱"
              @keydown.enter="onLogin"
              @input="form.email = StringUtil.filterSpecialChar(form.email)"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              show-password
              v-model="form.password"
              placeholder="密码"
              @keydown.enter="onLogin"
              @input="form.password = StringUtil.filterSpecialChar(form.password)"
            />
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%;" type="primary" @click="onLogin" :loading="loginLoading">登录</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="text">忘记密码</el-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- 注册 -->
      <template v-else>
        <div class="form-header">
          <div class="form-title">注册</div>
          <el-space class="form-info">已有账号? <el-button type="text" @click="isLogin = true">点击登录</el-button></el-space>
        </div>
        <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules">
          <el-form-item prop="email">
            <el-input placeholder="QQ邮箱" v-model="registerForm.email" @input="registerForm.email = StringUtil.filterSpecialChar(registerForm.email)" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="密码" v-model="registerForm.password" @input="registerForm.password = StringUtil.filterSpecialChar(registerForm.password)" />
          </el-form-item>
          <el-form-item prop="passwordRepeat">
            <el-input placeholder="重复" v-model="registerForm.passwordRepeat" @input="registerForm.passwordRepeat = StringUtil.filterSpecialChar(registerForm.passwordRepeat)" />
          </el-form-item>
          <el-form-item prop="code">
            <el-space>
              <el-input placeholder="验证码" v-model="registerForm.code" />
              <el-button :disabled="getCodeDisabled" @click="onRequestCode">获取 {{ getCodeDisabled ? ` (${intervalCnt})` : '' }}</el-button>
            </el-space>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%;" type="primary" @click="onRegister" :loading="registerLoading">注册</el-button>
          </el-form-item>
        </el-form>
      </template>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100% - 58px);
}

.container-form {
  min-width: 256px;
  padding: 64px;
  border-radius: 32px;
  box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.25), 0 0.7rem 0.7rem rgba(0, 0, 0, 0.22);
}

.form-header {
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
}

.form-info {
  font-size: 12px;
  color: #666;
}
</style>
