<script setup lang="ts">
import { articleApi, noteApi } from '@/api';
import { ArticleInfo, Note } from '@/types';
import { ElMessage } from 'element-plus';
import Vditor from 'vditor';
import { onMounted, reactive, ref, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { diff_match_patch } from '@/utils/diff_match_patch';
import { ElFile } from 'element-plus/es/components/upload/src/upload.type';
import { useAppStore } from '@/store';

const route = useRoute();
const router = useRouter();

// 网页参数
const noteId: number = Number(route.params.id);

const diff = ref<any[] | null>(null);
let isAlter: boolean = false;

const appSotre = useAppStore();

const note = ref<Note>();
const article = ref<ArticleInfo>();
const coverUrl = ref<string>('');
const loading = ref<boolean>(false);
const contentLoading = ref<boolean>(false);

const formRef = ref();
const uploadRef = ref();

const form = reactive<{
  coverUrl: string | null;
  noteId: number;
  summary: string | null;
  tags: string[];
  title: string;
}>({
  coverUrl: '',
  noteId: 0,
  summary: '',
  tags: [],
  title: ''
});

const rules = reactive({
  title: [
    {
      required: true,
      message: '请输入标题',
      trigger: 'blur'
    },
    {
      min: 1,
      max: 64,
      message: '长度必须在1到64之间',
      trigger: 'blur'
    },
  ],
  summary: [
    {
      max: 256,
      message: '长度不能超过256',
      trigger: 'blur'
    }
  ]
});

const beforeAvatarUpload = (file: ElFile): boolean => {
  const isJPG = file.type === 'image/jpeg';
  const isLt2M = file.size < 1024 * 1024;

  if (!isJPG) {
    ElMessage.error('头像图片必须为JPG格式!')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小超过 1MB!')
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

let __ifChangeCover = false;
const onChange = (file: any, fileList: any[]) => {
  const reader = new FileReader();
  reader.readAsDataURL(file.raw);
  reader.onload = function (e) {
    coverUrl.value = this.result as string;
    __ifChangeCover = true;
  }
}

const onSuccess = (res: any) => {
  if (res.data === undefined || res.code !== 200) {
    ElMessage.error(res.message);
    return;
  }

  form.coverUrl = res.data;

  __updateDate();
}

const onClick = () => {
  if (!formRef.value) return;
  formRef.value.validate((valid: boolean | undefined) => {
    if (valid) {
      if (__ifChangeCover) { // 上传图片后在更新
        uploadRef.value.submit();
        __ifChangeCover = false;
      } else {
        __updateDate();
      }
    }
  });
}

const __updateDate = () => {
  if (article.value !== undefined) {
    articleApi.set(article.value.id, {
      coverUrl: form.coverUrl ? form.coverUrl : undefined,
      summary: form.summary ? form.summary : undefined,
      tags: form.tags.length !== 0 ? form.tags : undefined,
      title: form.title
    }).then(res => {
      ElMessage.success('保存成功');
    });
  } else {
    articleApi.add({
      coverUrl: form.coverUrl ? form.coverUrl : undefined,
      noteId: form.noteId,
      summary: form.summary ? form.summary : undefined,
      tags: form.tags.length !== 0 ? form.tags : undefined,
      title: form.title
    }).then(res => {
      ElMessage.success('发布成功');
      router.replace(`/publish/article/${res.data.id}`)
    });
  }
}

const updateContent = () => {
  if (article.value === undefined) return;
  if (isAlter) {
    contentLoading.value = true;
    articleApi.set(article.value.id, { noteId: note.value?.id }).then(res => {
      contentLoading.value = false;
      ElMessage.success('更新成功');
    });
  } else {
    ElMessage.info('当前状态已为最新');
  }
};

const collapse = ref<boolean>(false); // 是否展开文件对比
const getContent = () => {
  collapse.value = true;
  nextTick(() => {
    if (diff.value != null) {
      for (let i = 0; i < diff.value.length; i++) {
        if (diff.value[i][0] !== 0) isAlter = true;
        const preview: HTMLElement | null = document.getElementById('preview' + i);
        Vditor.preview(preview as HTMLDivElement, diff.value[i][1]);
      }
    }
  });
}

onMounted(() => {
  if (isNaN(noteId)) {
    router.replace('/explore/404')
  }

  const dmp = new (diff_match_patch as any)();

  form.noteId = noteId;
  noteApi.get(noteId).then(res => {
    note.value = res.data;
    // 若文章存在 即笔记已发布 则获取文章信息
    if (note.value.articleId !== null) {
      articleApi.getMe(note.value.articleId).then(res => {
        article.value = res.data;
        coverUrl.value = appSotre.BASE_URL as string + article.value.coverUrl;
        form.title = article.value.title;
        form.summary = article.value.summary;
        form.tags = article.value.tagNames;
        diff.value = dmp.diff_main(article.value.content, note.value?.content);
        dmp.diff_cleanupSemantic(diff.value);
      });
    } else {
      form.title = note.value.name;

      diff.value = dmp.diff_main('', note.value?.content);
        dmp.diff_cleanupSemantic(diff.value);
    }
  }).catch(err => {
    console.log(err);
  });
});
</script>

<template>
  <h2>基本信息</h2>
  <el-form ref="formRef" :model="form" :rules="rules">
    <el-form-item prop="coverUrl" label="封面">
      <el-upload
        ref="uploadRef"
        class="cover-uploader"
        action="/api/upload/cover"
        :show-file-list="false"
        :auto-upload="false"
        :limit="1"
        :on-success="onSuccess"
        :before-upload="beforeAvatarUpload"
        :on-change="onChange"
        :on-exceed="onExceed"
      >
        <div class="uploader">
          <el-image v-if="coverUrl" class="image" :src="coverUrl" fit="cover" />
          <div v-else class="uploader-info">上传封面</div>
        </div>
      </el-upload>
    </el-form-item>
    <el-form-item prop="title" label="标题">
      <el-input v-model="form.title" placeholder="标题" />
    </el-form-item>
    <el-form-item prop="summary" label="简介">
      <el-input type="textarea" v-model="form.summary" placeholder="简介" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onClick" :loading="loading">
        {{ article !== undefined ? '保存修改' : '上传' }}
      </el-button>
      <el-button v-if="article !== undefined" type="primary" @click="updateContent" :loading="contentLoading">
        更新文章内容
      </el-button>
    </el-form-item>
  </el-form>
  <el-collapse>
    <el-collapse-item title="详细修改内容信息" @click.once="getContent">
      <div v-if="collapse">
        <div
          :class="{ preview: true, delete: item[0] === -1, equal: item[0] === 0, insert: item[0] === 1 }"
          :id="'preview' + index"
          v-for="(item, index) in diff" :key="index"
        >
          {{ 'preview' + index }}
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped>
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

.preview {
  padding: 4px 32px;
}

.delete {
  background-color: #ffdddd
}

.insert {
  background-color: #ccffdd;
}
</style>
