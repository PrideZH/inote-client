<script setup lang="ts">
import { userApi } from '@/api';
import { HttpResponse } from '@/api/interceptor';
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { ElFile } from 'element-plus/es/components/upload/src/upload.type';
import { ref } from 'vue';

const userStore = useUserStore();

const uploadRef = ref();
const avatar = ref<string>('');

const uploadUrl = import.meta.env.VITE_APP_BASE_URL + '/api/upload/avatar';

const beforeAvatarUpload = (file: ElFile): boolean => {
  const isJPG = file.type === 'image/jpeg';
  const isLt2M = file.size < 1024 * 500;

  if (!isJPG) {
    ElMessage.error('头像图片必须为JPG格式!')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小超过 500KB!')
  }
  return isJPG && isLt2M;
}

/**
 * 覆盖前一个图片
 */
const onExceed = (files: ElFile[]) => {
  uploadRef.value.clearFiles()
  uploadRef.value.handleStart(files[0])
}

const onChange = (file: any, fileList: any[]) => {
  const reader = new FileReader();
  reader.readAsDataURL(file.raw);
  reader.onload = function (e) {
    avatar.value = this.result as string;
  }
}

const onSuccess = (res: HttpResponse<string>) => {
  if (res.code !== 200) {
    ElMessage.error(res.message);
    return;
  }
  if (userStore.userInfo === null) return;
  userApi.updateUser(userStore.userInfo.id, { avatarUrl: res.data }).then(res => userStore.userInfo = res.data);
}
</script>

<template>
  <div class="avatar-container">
    <div class="upload-main">
      <el-upload
        class="avatar-uploader"
        ref="uploadRef"
        :action="uploadUrl"
        :headers="{
          'token': getToken()
        }"
        :show-file-list="false"
        :auto-upload="false"
        :limit="1"
        :on-success="onSuccess"
        :before-upload="beforeAvatarUpload"
        :on-change="onChange"
        :on-exceed="onExceed"
      >
        <div class="uploader">
          <el-image v-if="avatar !== ''" class="image" :src="avatar" fit="cover" />
          <el-icon v-else><plus /></el-icon>
        </div>
      </el-upload>
      <el-divider direction="vertical" style="height: 64px; margin: 0 32px;" />
      <div class="introduce-avatar">
        <el-avatar :src="userStore.avatarUrl" :size="80">inote</el-avatar>
        <div class="introduce-avatar-text">当前头像</div>
      </div>
    </div>
    <div class="upload-tips">请选择图片上传：只支持JPG格式，图片需小于500KB</div>
    <el-button type="primary" @click="uploadRef.submit()">更新</el-button>
  </div>
</template>

<style scoped>
.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-main {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
}

.uploader {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 160px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}

.uploader:hover {
  border-color: #409eff;
}

.image {
  max-height: 100%;
  max-width: 100%;
}

.introduce-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.introduce-avatar-text {
  margin-top: 8px;
  color: #999;
  font-size: 12px;
}

.upload-tips {
  margin: 32px 0;
  color: #999;
  font-size: 12px;
}
</style>
