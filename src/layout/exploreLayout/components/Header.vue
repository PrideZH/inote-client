<script setup lang="ts">
import { userApi } from '@/api';
import { openBlank, push } from '@/router';
import { useUserStore } from '@/store';
import { clearToken, isLogin } from '@/utils/auth';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const userStore = useUserStore();
const route = useRoute();

const search = ref<string>('');

const dropdownCommand = (command: string) => {
  if (command === 'account') {
    openBlank('/account')
  } else if (command === 'article') {
    openBlank('/publish')
  } else if (command === 'logout') {
    userApi.logout().then(res => {
      clearToken();
      push('/home');
    });
  }
}
</script>

<template>
  <div class="header">
    <el-space :size="32">
      <span class="logo-content" @click="push('/home')">iNote</span>
      <el-input v-if="route.path !== '/explore'" size="small" placeholder="文章搜索..." v-model="search" @keydown.enter="push(`/explore?s=${search}`)" />
    </el-space>
    <el-space class="header-right" :size="16">
      <el-dropdown v-if="isLogin()" @command="dropdownCommand">
        <el-avatar class="avatar" :src="userStore.avatarUrl" @click="openBlank(`/space/${userStore.userInfo?.id}`)">inote</el-avatar>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="account">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <template v-if="isLogin()">
        <div class="header-button" @click="openBlank('/message/reply')">消息</div>
        <div class="header-button" @click="openBlank(`/space/${userStore.userInfo?.id}/moment`)">动态</div>
        <div class="header-button" @click="openBlank(`/space/${userStore.userInfo?.id}/collection`)">收藏</div>
      </template>
      <el-button v-if="!isLogin()" @click="push('/home/login')">登录</el-button>
      <el-button v-else @click="push('/index')">
        <el-icon><svg t="1644907838923" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3902"><path d="M659.655431 521.588015q23.970037-6.71161 46.022472-13.423221 19.17603-5.752809 39.310861-11.505618t33.558052-10.546816l-13.423221 50.816479q-5.752809 21.093633-10.546816 31.640449-9.588015 25.88764-22.531835 47.940075t-24.449438 38.35206q-13.423221 19.17603-27.805243 35.475655l-117.932584 35.475655 96.838951 17.258427q-19.17603 16.299625-41.228464 33.558052-19.17603 14.382022-43.625468 30.202247t-51.29588 29.243446-59.925094 13.902622-62.801498-4.314607q-34.516854-4.794007-69.033708-16.299625 10.546816-16.299625 23.011236-36.434457 10.546816-17.258427 25.40824-40.749064t31.161049-52.254682q46.022472-77.662921 89.168539-152.449438t77.662921-135.191011q39.310861-69.992509 75.745318-132.314607-45.06367 51.775281-94.921348 116.014981-43.146067 54.651685-95.88015 129.917603t-107.385768 164.434457q-11.505618 18.217228-25.88764 42.187266t-30.202247 50.816479-32.599251 55.131086-33.078652 55.131086q-38.35206 62.322097-78.621723 130.397004 0.958801-20.134831 7.670412-51.775281 5.752809-26.846442 19.17603-67.116105t38.35206-94.921348q16.299625-34.516854 24.928839-53.692884t13.423221-29.722846q4.794007-11.505618 7.670412-15.340824-4.794007-5.752809-1.917603-23.011236 1.917603-15.340824 11.026217-44.58427t31.161049-81.977528q22.052434-53.692884 58.007491-115.535581t81.018727-122.726592 97.797753-117.932584 107.865169-101.153558 110.262172-72.389513 106.906367-32.11985q0.958801 33.558052-6.71161 88.689139t-19.17603 117.932584-25.88764 127.520599-27.805243 117.453184z" p-id="3903"></path></svg></el-icon>
        工作区
      </el-button>
    </el-space>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 5%);
  position: relative;
}

.logo-content {
  font-size: 32px;
  cursor: pointer;
}

.header-right {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.avatar {
  cursor: pointer;
}

.header-button {
  color: #212121;
  cursor: pointer;
}

.header-button:hover {
  color: var(--text-color-active);
}

.el-menu {
  justify-content: flex-end;
  min-width: 400px;
  border: none;
}
</style>
