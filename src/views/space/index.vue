<script setup lang="ts">
import { userApi } from '@/api';
import router from '@/router';
import { useAppStore } from '@/store';
import { UserInfo } from '@/types/user';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

/**
 * 用户空间
 */
const route = useRoute();

const appStore = useAppStore();

const userId: number = Number(route.params.id);
if (isNaN(userId)) {
  router.push('/404');
}

/**
 * 用户信息
 */
const userVO = ref<UserInfo>();
const isMe = ref<boolean>(false);

onMounted(() => {
  userApi.getUserInfo().then(res => {
    isMe.value = userId === res.data.id;
    if (isMe.value) {
      userVO.value = res.data as UserInfo;
    } else {
      userApi.get(userId).then(res => {
        userVO.value = res.data;
      });
    }
  });
});
</script>

<template>
  <div class="container">
    <div class="header" style="background-image: url('http://localhost:8080/cover/ca4e9b1b561fbcc4086c5f54c11ca2d0.jpg');">
      <div class="user-info">
        <el-avatar :size="64" :src="appStore.BASE_URL + userVO?.avatarUrl">inote</el-avatar>
        <div class="user-basic">
          <div class="nickname">{{ userVO?.nickname }}</div>
          <div class="profile">{{ userVO?.profile }}</div>
        </div>
        <div>
          <el-button v-if="!isMe" size="small">关注</el-button>
          <el-button v-if="!isMe" size="small">私信</el-button>
        </div>
      </div>
    </div>
    <div class="menu">
      <el-menu router :default-active="route.path" mode="horizontal" active-text-color="#00d6ac">
        <el-menu-item :index="`/space/${userId}`">
          <el-icon><svg t="1649760929034" class="icon" viewBox="0 0 1029 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2571" width="200" height="200"><path d="M1001.423238 494.592q21.504 20.48 22.528 45.056t-16.384 40.96q-19.456 17.408-45.056 16.384t-40.96-14.336q-5.12-4.096-31.232-28.672t-62.464-58.88-77.824-73.728-78.336-74.24-63.488-60.416-33.792-31.744q-32.768-29.696-64.512-28.672t-62.464 28.672q-10.24 9.216-38.4 35.328t-65.024 60.928-77.824 72.704-75.776 70.656-59.904 55.808-30.208 27.136q-15.36 12.288-40.96 13.312t-44.032-15.36q-20.48-18.432-19.456-44.544t17.408-41.472q6.144-6.144 37.888-35.84t75.776-70.656 94.72-88.064 94.208-88.064 74.752-70.144 36.352-34.304q38.912-37.888 83.968-38.4t76.8 30.208q6.144 5.12 25.6 24.064t47.616 46.08 62.976 60.928 70.656 68.096 70.144 68.096 62.976 60.928 48.128 46.592zM447.439238 346.112q25.6-23.552 61.44-25.088t64.512 25.088q3.072 3.072 18.432 17.408l38.912 35.84q22.528 21.504 50.688 48.128t57.856 53.248q68.608 63.488 153.6 142.336l0 194.56q0 22.528-16.896 39.936t-45.568 18.432l-193.536 0 0-158.72q0-33.792-31.744-33.792l-195.584 0q-17.408 0-24.064 10.24t-6.656 23.552q0 6.144-0.512 31.232t-0.512 53.76l0 73.728-187.392 0q-29.696 0-47.104-13.312t-17.408-37.888l0-203.776q83.968-76.8 152.576-139.264 28.672-26.624 57.344-52.736t52.224-47.616 39.424-36.352 19.968-18.944z" p-id="2572"></path></svg></el-icon>
          <span>文章</span>
        </el-menu-item>
        <el-menu-item v-if="isMe" :index="`/space/${userId}/moment`">
          <el-icon><svg t="1649770369871" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4067" width="200" height="200"><path d="M394.7 461.2c62.2 22.9 136.7-22.2 165.4-100.3l67-181.9c28.8-78.1-8.7-111.7-83.2-74.7L500.4 126c-74.5 37-154.3 118.2-177.2 180.5C300.3 368.6 332.4 438.3 394.7 461.2zM461.2 629.3c22.9-62.2-22.2-136.7-100.3-165.4l-181.9-67c-78.1-28.8-111.7 8.7-74.7 83.2l21.6 43.5c37 74.5 118.2 154.3 180.5 177.2C368.6 723.7 438.3 691.6 461.2 629.3zM919.6 543.9 898 500.4c-37-74.5-118.2-154.3-180.4-177.2-62.2-22.9-131.9 9.2-154.8 71.5-22.9 62.2 22.2 136.7 100.3 165.4l181.9 67C923.1 655.9 956.7 618.4 919.6 543.9zM629.3 562.8c-62.2-22.9-136.7 22.2-165.4 100.3l-67 181.9c-28.8 78.1 8.7 111.7 83.2 74.7l43.5-21.6c74.5-37 154.3-118.2 177.2-180.5C723.7 655.4 691.6 585.7 629.3 562.8z" p-id="4068"></path></svg></el-icon>
          <span>动态</span>
        </el-menu-item>
        <el-menu-item :index="`/space/${userId}/collection`">
          <el-icon><svg t="1649760977941" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4732" width="200" height="200"><path d="M570.5 135.2l99.2 209.6L873 366.4c45.8 4.9 63.2 62.6 27.6 91.9L738.7 591.9l50.2 224.2c10 44.8-38.6 79.7-77.8 55.9L523.5 757.9 335.9 872c-39.2 23.8-87.8-11.1-77.8-55.9l50.2-224.2-161.9-133.5c-35.6-29.3-18.2-87.1 27.6-91.9l203.2-21.6 99.2-209.6c18.9-39.8 75.3-39.8 94.1-0.1z" fill="#221714" p-id="4733"></path></svg></el-icon>
          <span>收藏</span>
        </el-menu-item>
        <el-menu-item v-if="isMe" :index="`/space/${userId}/setting`">
          <el-icon><svg t="1649761019448" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5599" width="200" height="200"><path d="M905.86 428.021h-0.002l-71.797-15.945c-5.594-17.868-12.887-34.998-21.324-51.473l38.849-64.668c14.509-23.2 21.803-57.282 0-79.129l-39.588-39.547c-10.662-10.708-24.994-15.206-39.461-15.206-14.985 0-30.151 4.895-41.465 12.759L668.1 214.924c-16.343-8.477-33.384-15.731-51.125-21.499l-16.121-72.621c-4.806-26.654-28.1-55.492-58.989-55.492h-55.932c-30.897 0-49.815 29.276-55.932 55.93l-17.963 71.746c-18.917 6.03-37.143 13.761-54.445 22.897l-64.538-41.075c-11.361-7.865-26.481-12.759-41.512-12.759-14.42 0-28.752 4.497-39.46 15.206l-39.543 39.547c-21.848 21.846-14.507 55.93 0 79.128l40.854 68.078c-7.644 15.469-14.461 31.374-19.705 48.064l-71.75 15.946c-26.654 4.812-55.495 28.099-55.495 58.995v55.93c0 30.889 29.277 49.813 55.932 55.93l72.665 18.13c5.029 15.428 11.273 30.237 18.4 44.569l-40.899 68.165c-14.508 23.157-21.807 57.24 0 79.087l39.588 39.548c10.663 10.704 24.994 15.248 39.455 15.248 14.991 0 30.151-4.894 41.471-12.758l64.672-41.249c17.432 9.217 35.744 17.041 54.795 23.071l17.917 71.573c6.118 26.653 25.035 55.931 55.932 55.931h55.933c30.89 0 54.184-28.84 58.989-55.493l16.122-72.838c17.565-5.685 34.433-12.853 50.559-21.194l63.1 40.199c11.313 7.866 26.481 12.76 41.465 12.76 14.467 0 28.8-4.546 39.461-15.248l39.588-39.548c21.803-21.847 14.509-55.93 0-79.089l-38.89-64.757c7.819-15.38 14.596-31.371 20.055-47.976l72.671-18.132c26.655-6.115 55.932-25.039 55.932-55.93v-55.93c-0.003-30.893-28.841-54.181-55.497-58.993zM514.684 648.029c-74.593 0-135.333-60.562-135.333-134.931s60.739-134.889 135.333-134.889c74.588 0 135.287 60.52 135.287 134.889s-60.699 134.931-135.287 134.931z" fill="#515151" p-id="5600"></path></svg></el-icon>
          <span>设置</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: calc(100% - 48px);
  padding: 0 128px;
  background-color: #f4f5f7;
}

.header {
  padding-top: 116px;
  border: 1px solid #eee;
  border-bottom: none;
  background-color: #fff;
  background-position: 50%;
  background-size: cover;
}

.menu {
  border: 1px solid #eee;
  border-top: none;
}

.user-info {
  display: flex;
  padding: 12px 32px;
}

.user-basic {
  padding: 4px 16px;
}

.nickname {
  color: #fff;
  font-weight: 700;
  font-size: 18px;
}

.profile {
  padding: 4px 0;
  color: hsla(0,0%,100%,.8);
  font-size: 12px;
  font-family: Microsoft Yahei;
}

.main {
  display: flex;
  margin-top: 8px;
  background-color: #f4f5f7;
}
</style>
