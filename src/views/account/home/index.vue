<script setup lang="ts">
import { useUserStore } from '@/store';

const userStore = useUserStore();
</script>

<template>
  <div>
    <div class="introduce">
      <el-avatar class="introduce-avatar" :src="userStore.avatarUrl">inote</el-avatar>
      <div class="introduce-info">
        <div>{{ userStore.userInfo?.nickname }}</div>
        <div class="introduce-username">{{ userStore.userInfo?.username }}</div>
      </div>
      <div>
        <el-button size="small">修改资料</el-button>
        <el-button size="small">个人空间</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.introduce {
  display: flex;
}

.introduce-avatar {
  margin-right: 16px;
}

.introduce-info {
  flex: 1;
}

.introduce-username {
  color: #777;
  font-size: 12px;
}
</style>
