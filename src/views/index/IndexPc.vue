<script setup lang="ts">
import { useAppStore, useDirStore, usePathStore } from '@/store';
import { nextTick, onMounted, reactive, ref } from 'vue';

import Directory from './components/Directory.vue';
import { useRoute } from 'vue-router';
import { StringUtil } from '@/utils/StringUtil';
import IconBtn from '@/components/IconBtn.vue';
import { TimeUtil } from '@/utils/TimeUtil';
import { articleApi, folderApi, noteApi } from '@/api';
import { ElMessage } from 'element-plus';
import { openBlank } from '@/router';
import { ArtivleData } from '@/api/article';
import { HttpResponse } from '@/api/interceptor';
import { getToken } from '@/utils/auth';

const route = useRoute();

const dirStore = useDirStore();
const appStore = useAppStore();
const pathStore = usePathStore();

// 根据ID打开笔记 若无ID则打开随手记
const __itemType = String(route.query.type);
const itemType: 'note' | 'folder' | null =  (__itemType && __itemType === 'note' || __itemType === 'folder') ? __itemType : null;
const itemId: number = Number(route.query.n);

// 修改笔记名
let __oldName: string = '';
const prepareSetItemNmae = () => {
  if (!pathStore.pathItem) return;
  __oldName = pathStore.pathItem.name;
}
const setItemName = () => {
  if (!pathStore.pathItem) return;
  if (StringUtil.isBlank(pathStore.pathItem.name)) {
    ElMessage.error('笔记名不能为空');
    pathStore.pathItem.name = __oldName;
    return;
  } else if (pathStore.pathItem.name === __oldName) {
    return;
  }
  if (pathStore.pathItem.type === 'note') {
    noteApi.set(pathStore.pathItem.id, { name: pathStore.pathItem.name }).then(res => {
      dirStore.refreshTree();
    }).catch(err => {
      if (pathStore.pathItem) {
        pathStore.pathItem.name = __oldName;
      }
    });
  } else if (pathStore.pathItem.type === 'folder') {
    folderApi.set(pathStore.pathItem.id, { name: pathStore.pathItem.name }).then(res => {
      dirStore.refreshTree();
    }).catch(err => {
      if (pathStore.pathItem) {
        pathStore.pathItem.name = __oldName;
      }
    });
  }
}

// 创建笔记
const onCreateNote = () => {
  if (!pathStore.pathItem || pathStore.pathItem.type !== 'folder') {
    return;
  }
  noteApi.add({ name: '未命名' }).then(res => {
    if (!pathStore.pathItem) return;
    folderApi.addRelevance({ noteId: res.data.id, folderId: pathStore.pathItem.id }).then(res => {
      dirStore.refreshTree();
    });
    pathStore.openItem('note', res.data.id);
  });
}

// 创建文件夹
const onCreateFolder = () => {
  if (!pathStore.pathItem || pathStore.pathItem.type !== 'folder') {
    return;
  }
  // 获取新建文件夹重名最大下标
  let inx: number = 1;
  for (let i = 0; pathStore.pathItem.children && i < pathStore.pathItem.children?.length; i++) {
    let item = pathStore.pathItem.children[i];
    if (item.name === '新建文件夹') {
      inx++;
      break;
    }
  }
  for (let i = 0; pathStore.pathItem.children && i < pathStore.pathItem.children?.length; i++) {
    let item = pathStore.pathItem.children[i];
    if (item.note) continue;
    let reg = /新建文件夹 \((.*)\)/;
    let res = reg.exec(item.name);
    if (!res) continue;
    let num = Number(res[1]);
    if (!isNaN(num) && num >= inx) {
      inx = num + 1;
    }
  }
  folderApi.add({ name: '新建文件夹' + (inx === 1 ? '' : ` (${inx})`), parentId: pathStore.pathItem.id }).then(res => {
    dirStore.refreshTree();
    pathStore.openItem('folder', res.data.id);
  });
}

// 添加笔记
const onAppendNote = () => {

}

// 上传文件
const onUpload = () => {

}


/**
 * 笔记的发布和更新
 */
// 发布和更新按钮加载状态
const publishLoading = ref<boolean>(false);

// 发布笔记
const onPublishArticle = () => {
  if (!pathStore.pathItem || pathStore.pathItem.type !== 'note') {
    return;
  }
  let noteId = pathStore.pathItem.id;
  let title = pathStore.pathItem.name;
  articleApi.add({ noteId, title }).then(res => {
    ElMessage.success('发布成功');
    if (pathStore.pathItem) {
      pathStore.pathItem.article = res.data;
    }
  });
}

// 更新文章内容
const onUpdateArticle = () => {
  if (!pathStore.pathItem || pathStore.pathItem.type !== 'note') {
    return;
  }
  let articleId = pathStore.pathItem.article?.id;
  if (!articleId) {
    return;
  }
  let noteId = pathStore.pathItem.id;
  articleApi.set(articleId, { noteId }).then(res => {
    publishLoading.value = false;
    ElMessage.success('更新成功');
  });
}

/**
 * 文章设置
 */
const modifyArticleDialogVisible = ref<boolean>(false);
const modifyArticleLoading = ref<boolean>(false);

const ArticleForm = reactive<ArtivleData>({
  coverUrl: undefined,
  noteId: undefined,
  status: undefined,
  summary: undefined,
  tags: [],
  title: undefined,
});

const ArticleOpen = () => {
  if (!pathStore.pathItem || !pathStore.pathItem.article) {
    return;
  }

  ArticleForm.coverUrl = pathStore.pathItem.article.coverUrl || undefined;
  ArticleForm.noteId = pathStore.pathItem.id || undefined;
  ArticleForm.status = pathStore.pathItem.article.status || undefined;
  ArticleForm.summary = pathStore.pathItem.article.summary || undefined;
  ArticleForm.tags = pathStore.pathItem.article.tagNames || [];
  ArticleForm.title = pathStore.pathItem.article.title || undefined;

  modifyArticleDialogVisible.value = true;
}

const ArticleConfirm = () => {
  if (!pathStore.pathItem || !pathStore.pathItem.article) {
    return;
  }

  modifyArticleLoading.value = true;
  articleApi.set(pathStore.pathItem.article.id, ArticleForm).then(res => {
    ElMessage.success('修改成功');
    if (pathStore.pathItem) {
      pathStore.pathItem.article = res.data;
    }
    modifyArticleDialogVisible.value = false;
    modifyArticleLoading.value = false;
  });
}

/**
 * 图片上传
 */
const uploadRef = ref();
// 图片上传API
const baseUrl: string = import.meta.env.VITE_APP_BASE_URL as string;
const uploadUrl = baseUrl + '/api/upload/cover';

// 上传成功 获取响应数据
const onSuccess = (res: HttpResponse<string>) => {
  if (res.code !== 200) {
    ElMessage.error(res.message);
    return;
  }
  if (res.data === undefined || res.code !== 200) {
    ElMessage.error(res.message);
    return;
  }

  ArticleForm.coverUrl = res.data;
}

const beforeAvatarUpload = (file: any): boolean => {
  const isJPG = file.type === 'image/jpeg';
  const isLt2M = file.size < 5 * 1024 * 1024;

  if (!isJPG) {
    ElMessage.error('封面图片必须为JPG格式!')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小超过 5MB!')
  }
  return isJPG && isLt2M;
}

let __ifChangeCover = false;
const onChange = (file: any, fileList: any[]) => {
  // const reader = new FileReader();
  // reader.readAsDataURL(file.raw);
  // reader.onload = function (e) {
  //   ArticleForm.coverUrl = this.result as string;
  //   __ifChangeCover = true;
  // }
  uploadRef.value.submit();
}

const onExceed = (files: any[]) => {
  uploadRef.value.clearFiles()
  uploadRef.value.handleStart(files[0])
}

/**
 * 文章标签
 */
const InputRef = ref();
// 是否显示标签输入框
const inputVisible = ref<boolean>(false);
// 标签输入框内容
const inputValue = ref<string>('');

// 显示标签输入框
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

// 确认标签输入
const onInputConfirm = () => {
  inputValue.value = inputValue.value.trim();
  inputValue.value = inputValue.value.toLowerCase();
  if (inputValue.value && ArticleForm.tags) {
    // 判断是否重复
    let isRepetition: boolean = false;
    for (let i = 0; i < ArticleForm.tags.length; i++) {
      if (ArticleForm.tags[i] === inputValue.value) {
        isRepetition = true;
        break;
      }
    }
    if (!isRepetition) {
      ArticleForm.tags.push(inputValue.value)
    } else {
      ElMessage.info('标签重复');
    }
  }
  inputVisible.value = false
  inputValue.value = ''
}

// 删除标签
const handleClose = (tag: string) => {
  if (!ArticleForm.tags) {
    return;
  }
  ArticleForm.tags.splice(ArticleForm.tags.indexOf(tag), 1);
}

onMounted(() => {
  pathStore.init(itemType, isNaN(itemId) ? null : itemId);
});
</script>

<template>
  <div class="note-aside" v-show="!appStore.fullscreen">
    <Directory />
  </div>
  <div class="note-container">
    <div class="note-header">
      <div class="note-header-left">
        <IconBtn>
          <el-icon><svg t="1648367805713" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2202" width="200" height="200"><path d="M170.666667 213.333333h682.666666v85.333334H170.666667V213.333333z m0 512h682.666666v85.333334H170.666667v-85.333334z m0-256h682.666666v85.333334H170.666667v-85.333334z" fill="#444444" p-id="2203"></path></svg></el-icon>
        </IconBtn>
        <div class="breadcrumb">
          <div class="breadcrumb-item" v-for="(item, index) in pathStore.pathItems">
            <div class="breadcrumb-item-btn" @click="pathStore.openItem(item.type, item.id, false)">{{ item.name }}</div>
            <div class="breadcrumb-item-divider" v-if="index !== pathStore.pathItems.length - 1"> / </div>
          </div>
        </div>
      </div>
      <div class="note-header-right" v-if="pathStore.pathItem && pathStore.pathItem.id && pathStore.pathItem.type === 'note'">
        <el-space class="note-detail-right">
          <el-button
              v-if="pathStore.pathItem.article === null"
              size="small"
              :loading="publishLoading"
              @click="onPublishArticle">发布</el-button>
          <el-button
              v-else
              size="small"
              :loading="publishLoading"
              @click="onUpdateArticle">更新</el-button>
          <el-popover trigger="click" v-if="pathStore.pathItem.article">
            <template #reference>
              <IconBtn><el-icon><svg t="1648261367198" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2434" width="200" height="200"><path d="M288 456.864A63.264 63.264 0 0 0 256 448a64 64 0 1 0 0 128c11.712 0 22.56-3.392 32-8.896 19.04-11.072 32-31.488 32-55.104 0-23.648-12.96-44.064-32-55.136M544 456.864A63.264 63.264 0 0 0 512 448c-11.712 0-22.56 3.36-32 8.864-19.04 11.072-32 31.488-32 55.136 0 23.616 12.96 44.032 32 55.104 9.44 5.504 20.288 8.896 32 8.896s22.56-3.392 32-8.896c19.04-11.072 32-31.488 32-55.104 0-23.648-12.96-44.064-32-55.136M768 448c-11.712 0-22.56 3.392-32 8.864-19.04 11.104-32 31.52-32 55.136 0 23.616 12.96 44.032 32 55.136 9.44 5.472 20.288 8.864 32 8.864a64 64 0 1 0 0-128" p-id="2435"></path></svg></el-icon></IconBtn>
            </template>
            <el-space class="more-menu-item" @click="openBlank(`/article/${pathStore.pathItem?.article?.id}`)">
              <el-icon><svg t="1648987780619" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10105" width="200" height="200"><path d="M512 302c-162.377 0-304.149 85.065-380 211.5C207.851 639.935 349.623 725 512 725s304.149-85.065 380-211.5C816.149 387.065 674.377 302 512 302z m0-88.35c189.522 0 361.931 97.994 455.762 254.399a88.35 88.35 0 0 1 0 90.902C873.932 715.356 701.522 813.35 512 813.35S150.069 715.356 56.238 558.951a88.35 88.35 0 0 1 0-90.902C150.068 311.644 322.478 213.65 512 213.65z m0.5 428.525c-71.065 0-128.675-57.61-128.675-128.675 0-71.065 57.61-128.675 128.675-128.675 71.065 0 128.675 57.61 128.675 128.675 0 71.065-57.61 128.675-128.675 128.675z m0-88.35c22.27 0 40.325-18.054 40.325-40.325 0-22.27-18.054-40.325-40.325-40.325-22.27 0-40.325 18.054-40.325 40.325 0 22.27 18.054 40.325 40.325 40.325z" p-id="10106"></path></svg></el-icon>
              文章浏览
            </el-space>
            <el-space class="more-menu-item" :loading="modifyArticleLoading" @click="ArticleOpen">
              <el-icon><svg t="1648987745637" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9237" width="200" height="200"><path d="M512.3 349.8c-89 0-161.4 72.4-161.4 161.3 0 89 72.4 161.4 161.4 161.4s161.3-72.4 161.3-161.4c0-88.9-72.4-161.3-161.3-161.3z m99.6 161.4c0 54.9-44.7 99.6-99.6 99.6s-99.6-44.7-99.6-99.6c0-54.9 44.7-99.6 99.6-99.6s99.6 44.7 99.6 99.6z" p-id="9238"></path><path d="M933.5 476.6c-0.5-5.7-1-11.5-1.7-17.2-1.9-15.5-4.7-31-8.7-47.4l-1.3-5.3-5.3-1.3c-38.6-9.6-73-36.2-94.3-73.1-21.3-36.9-27.2-80-16.1-118.2l1.5-5.3-4-3.8c-11.2-10.7-23.2-20.8-36.7-31.1l-6.3-4.8-0.1 0.1c-18.3-13.3-37.6-25.1-57.8-35.4-11-5.6-22.4-10.7-33.9-15.4l-2.8-1c-12-4.7-23.1-8.6-34-11.8l-5.3-1.6-3.8 4c-27.6 28.8-67.9 45.3-110.6 45.3s-83-16.5-110.6-45.3l-3.8-4-5.3 1.6c-10.9 3.2-22 7-34 11.8l-2.8 1c-11.5 4.6-22.9 9.8-34.2 15.5-22.2 11.3-43.7 24.8-63.8 39.9-13.5 10.2-25.5 20.4-36.7 31.1l-4 3.8 1.5 5.3c11 38.3 5.1 81.4-16.1 118.2-21.3 36.9-55.7 63.5-94.3 73.1l-5.3 1.3-1.3 5.4c-4 16.6-6.8 32.1-8.6 47.4-0.6 5.3-1.1 10.6-1.6 16l-0.2 2.5c-0.7 9.6-1.7 21.5-1.7 33.3 0 10.9 0.7 21.5 1.7 33.4l0.3 2.9c0.5 5.2 0.9 10.3 1.5 15.5 1.9 15.3 4.7 30.8 8.7 47.4l1.3 5.4 5.4 1.3c38.7 9.6 73.1 36.2 94.4 73.1 21.3 36.9 27.2 80 16.1 118.3l-1.5 5.3 4 3.8c11.2 10.6 23.5 21.1 36.8 31.1l14.5 11v-0.5c15.8 10.9 32.4 20.9 49.6 29.6 10.8 5.5 22.2 10.7 33.8 15.4l2.9 1.1c12 4.7 23.1 8.6 33.9 11.8l5.3 1.6 3.8-4c27.6-28.8 67.9-45.3 110.6-45.3 42.7 0 83.1 16.5 110.6 45.3l3.8 4 5.3-1.6c10.9-3.2 21.9-7 35-12.1l1.8-0.7c11.6-4.7 23-9.8 34.2-15.5 22.2-11.4 43.7-24.8 63.8-39.9 13.2-9.9 25.6-20.4 36.7-31.1l4-3.8-1.5-5.3c-11-38.3-5.1-81.4 16.1-118.3 21.3-36.9 55.7-63.5 94.4-73.1l5.4-1.3 1.3-5.4c3.9-16.5 6.8-32 8.6-47.4 0.7-5.6 1.2-11.2 1.8-18.4 0.9-11.2 1.7-22.2 1.7-33.3-0.3-11.4-1.1-22-2.1-34.9zM739.7 791.1c-30.2 24.5-63.3 43.7-98.5 57.2-36.5-26.5-82.1-41-128.9-41s-92.5 14.5-128.9 41c-35.3-13.5-68.4-32.7-98.5-57.2 4.6-44.7-5.6-91.4-29-131.9-23.5-40.7-59-73-100.2-91.3-3-19.2-4.6-38.3-4.6-56.8s1.6-37.6 4.6-56.8C197 436 232.4 403.7 255.9 363c23.4-40.5 33.6-87.1 29-131.8 30.1-24.5 63.3-43.7 98.6-57.2 36.5 26.4 82 41 128.9 41s92.5-14.5 128.9-41c35.3 13.5 68.5 32.8 98.6 57.2-4.6 44.7 5.6 91.3 29 131.8 23.5 40.7 58.9 72.9 100.2 91.3 3.1 19.3 4.6 38.4 4.6 56.8S872 548.7 869 568c-41.3 18.3-76.7 50.6-100.2 91.3-23.4 40.5-33.7 87.1-29.1 131.8z" p-id="9239"></path></svg></el-icon>
              文章设置
            </el-space>
            <el-space class="more-menu-item">
              <el-icon><svg t="1648261282842" class="icon" viewBox="0 0 1029 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1628" width="200" height="200"><path d="M761.216 997.76c-144.64 0-262.4-117.76-262.4-262.4s117.76-262.4 262.4-262.4 262.4 117.76 262.4 262.4-117.76 262.4-262.4 262.4z m0-448c-102.4 0-185.6 83.2-185.6 185.6s83.2 185.6 185.6 185.6 185.6-83.2 185.6-185.6-83.328-185.6-185.6-185.6z" p-id="1629"></path><path d="M858.496 815.872l-116.48-58.24V588.16h51.2v137.728l88.192 44.16zM174.08 269.312h422.4v51.2h-422.4zM174.08 448.512h281.6v51.2h-281.6zM174.08 627.712h192v51.2h-192z" p-id="1630"></path><path d="M442.88 922.112H0v-883.2h775.68v364.8h-76.8V115.712H76.8v729.6h366.08z" p-id="1631"></path></svg></el-icon>
              查看历史版本
            </el-space>
            <div class="more-menu-divider" />
            <div class="more-menu-info">文章状态：所有人可见</div>
            <div class="more-menu-info">创建时间：{{ TimeUtil.concise(pathStore.pathItem.article.createTime) }}</div>
            <div class="more-menu-info">更新时间：{{ TimeUtil.concise(pathStore.pathItem.article.updateTime) }}</div>
          </el-popover>
        </el-space>
      </div>
    </div>
    <div
      v-show="pathStore.pathItem !== null && pathStore.pathItem.type === 'note'"
      id="editor"
      @keydown.ctrl.s.prevent="pathStore.saveCurrentNote()"
    />
    <div id="item-info">
      <div class="info-content" v-if="pathStore.pathItem">
        <input
            v-if="pathStore.pathItem.id !== 0"
            class="note-name" v-model="pathStore.pathItem.name" placeholder="未命名"
            @focus="prepareSetItemNmae" @blur="setItemName" />
        <div v-else class="note-name">
          {{ pathStore.pathItem.name }}
        </div>
        <div class="note-detail">
          <el-space class="note-detail-left">
            <div v-if="pathStore.pathItem.type === 'note'">NID：note_{{ pathStore.pathItem.id }}</div>
            <div class="more-menu-info">创建时间：{{ TimeUtil.concise(pathStore.pathItem.createTime) }}</div>
            <div class="more-menu-info">修改时间：{{ TimeUtil.concise(pathStore.pathItem.updateTime) }}</div>
          </el-space>
          <div class="note-detail-right">
            <template v-if="pathStore.pathItem.type === 'folder'">
              <el-button type="text" @click="onCreateNote">+ 新建笔记</el-button>
              <el-button type="text" @click="onCreateFolder">+ 新建文件夹</el-button>
              <el-button type="text">+ 添加笔记</el-button>
              <el-button type="text">+ 上传</el-button>
            </template>
          </div>
        </div>
        <!-- <div class="note-template" v-show="StringUtil.isBlank(pathStore.pathItem.content)">
          <el-icon><Present /></el-icon> 从模板创建
        </div> -->
      </div>
      <div v-if="pathStore.pathItem && pathStore.pathItem.type==='folder'" class="folder-info">
        <el-table :data="pathStore.pathItem.children" style="width: 98%">
          <el-table-column label="name" width="文件名">
            <template #default="scope">
              <el-button
                  type="text"
                  @click="pathStore.openItem(scope.row.note ? 'note' : 'folder', scope.row.note ? scope.row.noteId : scope.row.id, false)">
                <el-space>
                  <el-icon>
                    <template v-if="scope.row.note">
                      <svg v-if="scope.row.share" t="1648985526458" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7434" width="200" height="200"><path d="M479 893.514H163.112c-15.779 0-19.088-11.404-19.088-15.792v-765.49c0-5.564 5.024-15.709 15.5-15.709s694.962-0.126 705.219-0.126 14.4 8.372 14.4 14.238l0.029 450.611c0 8.994 7.506 16.5 16.5 16.5s16.5-7.506 16.5-16.5V113.691c0-16.642-7.154-31.122-20.447-41.116-12.164-9.144-25.964-9.053-40.108-9.053h-690.93c-14.416 0-28.784 5.788-38.03 17.108-7.786 9.532-11.633 20.747-11.633 33.035v763.792c0 18.321 10.354 36.11 27.115 44.028 15.061 7.114 33.404 5.029 49.662 5.029h291.2c8.995 0 16.5-7.506 16.5-16.5s-7.506-16.5-16.501-16.5z" p-id="7435"></path><path d="M784.649 255.605c0-8.995-7.506-16.5-16.5-16.5h-512.1c-8.995 0-16.5 7.505-16.5 16.5s7.505 16.5 16.5 16.5h512.1c8.995 0 16.5-7.505 16.5-16.5zM763.5 485.092c0-8.995-7.506-16.5-16.5-16.5H256.05c-8.995 0-16.5 7.505-16.5 16.5s7.505 16.5 16.5 16.5H747c8.994 0 16.5-7.506 16.5-16.5zM256.05 694.439c-8.995 0-16.5 7.506-16.5 16.5s7.505 16.5 16.5 16.5H459c8.995 0 16.5-7.506 16.5-16.5s-7.505-16.5-16.5-16.5H256.05zM934.09 793.837c-8.994 0-16.5 7.506-16.5 16.5 0 24.626 0.15 91.526-0.028 100.343-0.092 4.548 1.562 16.089-17.537 16.089H616.866c-19.279 0-17.866-17.354-17.866-24.815V711.456c0-10.796 5.794-17.551 17.505-17.551h95.589c8.994 0 16.5-7.506 16.5-16.5s-7.515-16.281-16.509-16.281c-24.76 0-70.206 0.062-101.16 0.062S566 683.034 566 712.054V904.83c0 45.663 23.571 54.938 55.811 54.938h277.914c45.325 0 50.865-21.191 50.865-51.9v-97.531c0-8.994-7.506-16.5-16.5-16.5z" p-id="7436"></path><path d="M966.455 691.447c-0.485-3.043-1.919-5.99-4.507-8.578-0.819-0.819-1.768-1.536-2.792-2.163-0.183-0.139-0.359-0.282-0.547-0.417l-69.187-49.875c-7.312-5.271-18.357-1.282-22.575 5.919-4.874 8.321-1.361 17.327 5.919 22.575l28.694 20.686 0.73 1.589c-95.229 4.103-175.31 66.313-205.308 151.89 0 0-4.591 13.603 10.916 19.141 15.25 5.446 19.743-8.351 19.743-8.351 26.581-76.012 99.222-130.567 184.68-130.567 0.695 0 1.385 0.021 2.078 0.027l-30.873 38.672c-5.606 7.021-6.887 16.447 0 23.334 5.825 5.826 17.714 7.04 23.334 0l55.187-69.125c0.057-0.07 0.105-0.145 0.16-0.216 1.916-2.002 3.363-4.446 4.083-7.064 0.727-2.636 0.761-5.141 0.265-7.477z" p-id="7437"></path></svg>
                      <svg v-else t="1648985629921" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8264" width="200" height="200"><path d="M704 914.474667c2.901333-2.304 5.504-4.736 7.808-7.253334l112.64-122.368c8.704-9.472 16.469333-23.552 21.76-38.186666H768c-35.541333 0-64 28.586667-64 64.213333v103.594667z m-42.666667 21.162666v-124.757333A106.581333 106.581333 0 0 1 768 704h85.333333V159.530667C853.333333 118.698667 822.784 85.333333 785.066667 85.333333H238.933333C201.344 85.333333 170.666667 118.570667 170.666667 159.573333v704.853334c0 41.045333 30.549333 74.24 68.266666 74.24h401.365334c6.528 0 13.738667-1.066667 21.034666-2.986667zM640.298667 981.333333H238.933333C176.810667 981.333333 128 928.256 128 864.426667V159.573333C128 95.786667 176.896 42.666667 238.933333 42.666667h546.133334C847.146667 42.666667 896 95.829333 896 159.530667v551.168c0 34.389333-16.853333 77.696-40.192 103.04l-112.64 122.410666c-24.021333 26.112-67.413333 45.184-102.826667 45.184z" p-id="8265"></path><path d="M320 256h256a21.333333 21.333333 0 1 0 0-42.666667h-256a21.333333 21.333333 0 0 0 0 42.666667zM320 426.666667h341.333333a21.333333 21.333333 0 1 0 0-42.666667h-341.333333a21.333333 21.333333 0 0 0 0 42.666667zM320 597.333333h341.333333a21.333333 21.333333 0 1 0 0-42.666666h-341.333333a21.333333 21.333333 0 1 0 0 42.666666z" p-id="8266"></path></svg>
                    </template>
                    <template v-else>
                      <svg v-if="scope.row.share" t="1648977220855" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3123" width="200" height="200"><path d="M970.666667 213.333333H546.586667a10.573333 10.573333 0 0 1-7.54-3.126666L429.793333 100.953333A52.986667 52.986667 0 0 0 392.08 85.333333H96a53.393333 53.393333 0 0 0-53.333333 53.333334v704a53.393333 53.393333 0 0 0 53.333333 53.333333h874.666667a53.393333 53.393333 0 0 0 53.333333-53.333333V266.666667a53.393333 53.393333 0 0 0-53.333333-53.333334z m10.666666 629.333334a10.666667 10.666667 0 0 1-10.666666 10.666666H96a10.666667 10.666667 0 0 1-10.666667-10.666666V138.666667a10.666667 10.666667 0 0 1 10.666667-10.666667h296.08a10.573333 10.573333 0 0 1 7.54 3.126667l109.253333 109.253333A52.986667 52.986667 0 0 0 546.586667 256H970.666667a10.666667 10.666667 0 0 1 10.666666 10.666667zM640 341.333333a85.333333 85.333333 0 0 0-81.826667 109.553334l-71.673333 43a85.333333 85.333333 0 1 0-6.566667 127.393333l38.506667 28.88a85.526667 85.526667 0 1 0 25.626667-34.106667l-38.506667-28.88a85.333333 85.333333 0 0 0 2.933333-56.726666l71.673334-43A85.333333 85.333333 0 1 0 640 341.333333zM426.666667 597.333333a42.666667 42.666667 0 1 1 42.666666-42.666666 42.713333 42.713333 0 0 1-42.666666 42.666666z m170.666666 42.666667a42.666667 42.666667 0 1 1-42.666666 42.666667 42.713333 42.713333 0 0 1 42.666666-42.666667z m42.666667-170.666667a42.666667 42.666667 0 1 1 42.666667-42.666666 42.713333 42.713333 0 0 1-42.666667 42.666666z" fill="#5C5C66" p-id="3124"></path></svg>
                      <svg v-else t="1648977077454" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2979" width="200" height="200"><path d="M912 208H427.872l-50.368-94.176A63.936 63.936 0 0 0 321.056 80H112c-35.296 0-64 28.704-64 64v736c0 35.296 28.704 64 64 64h800c35.296 0 64-28.704 64-64v-608c0-35.296-28.704-64-64-64z m-800-64h209.056l68.448 128H912v97.984c-0.416 0-0.8-0.128-1.216-0.128H113.248c-0.416 0-0.8 0.128-1.248 0.128V144z m0 736v-96l1.248-350.144 798.752 1.216V784h0.064v96H112z" p-id="2980"></path></svg>
                    </template>
                  </el-icon>
                  {{ scope.row.name }}
                </el-space>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="上次修改时间" />
        </el-table>
      </div>
    </div>
    <!-- <div class="note-footer">
    </div> -->
  </div>

  <el-dialog v-model="modifyArticleDialogVisible" title="设置" width="30%">
    <el-form :model="ArticleForm">
      <el-form-item label="标题">
        <el-input v-model="ArticleForm.title" />
      </el-form-item>
      <el-form-item label="摘要">
        <el-input type="textarea" v-model="ArticleForm.summary" maxlength="256" />
      </el-form-item>
      <el-form-item label="封面">
        <el-upload
          ref="uploadRef"
          class="cover-uploader"
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
            <el-image v-if="ArticleForm.coverUrl" class="image" :src="baseUrl + ArticleForm.coverUrl" fit="cover" />
            <div v-else class="uploader-info">上传封面</div>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="标签">
        <el-space wrap>
          <el-tag
            v-for="tag in ArticleForm.tags" :key="tag"
            closable :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            size="small"
            @keyup.enter="onInputConfirm"
            @blur="onInputConfirm"
          />
          <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">+</el-button>
        </el-space>
      </el-form-item>
      <el-form-item label="权限">
        <el-select v-model="ArticleForm.status">
          <el-option :key="0" label="仅自己可见" :value="0"/>
          <el-option :key="1" label="所有人可见" :value="1"/>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="ArticleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
#editor >>> .vditor-toolbar {
  display: none;
}

.vditor-outline >>> .vditor-outline__title {
  display: none;
}

.vditor-outline >>> li>span:hover {
  color: #4285f4;
}

.vditor-outline >>> svg {
  margin-right: 5px;
}

.vditor-outline >>> li {
  font-size: var(--el-font-size-base);
}

.note-container {
  position: relative;
  flex: 1;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;
  padding: 0 32px;
}

.note-header-left {
  display: flex;
  align-items: center;
  float: left;
}

.breadcrumb {
  display: flex;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-item-btn {
  padding: 2px 4px;
  cursor: pointer;
}

.breadcrumb-item-btn:hover {
  background-color: #f0f0f0;
}

.breadcrumb-item-divider {
  margin: 0 4px;
  color: var(--text-color-info);
}

.note-header-right {
  float: right;
}

#item-info {
  margin: 0 32px;
}

.info-content {
  padding: 24px 32px;
  border-bottom: 1px solid #f4f4f4;
}

.note-name {
  width: 100%;
  margin: 16px 0;
  border: none;
  font-size: 32px;
  font-weight: 700;
}

.note-name:focus {
  outline: none;
}

.note-template {
  display: flex;
  padding: 4px 2px;
  align-items: center;
  color: #bbbbbb;
  cursor: pointer;
}

.note-template:hover {
  background-color: #e3f2ff;
}

.note-detail {
  display: flex;
  align-items: center;
}

.note-detail-left {
  flex: 1;
  font-size: 12px;
  color: var(--text-color-info);
}

.more-menu-item {
  padding: 4px 8px;
  width: 100%;
  cursor: pointer;
  box-sizing: border-box;
}

.more-menu-item:hover {
  background-color: #f5f5f5;
}

.more-menu-divider {
  margin: 2px;
  border-bottom: 1px solid #ddd;
}

.more-menu-info {
  font-size: 12px;
  color: var(--text-color-info);
}

.folder-info {
  padding: 24px 32px;
}

.note-detail >>> .el-collapse-item__header {
  height: 22px;
  line-height: 22px;
  font-weight: 700;
  background-color: #fafafa;
}

.note-detail >>> .el-collapse-item__content {
  padding-bottom: 0;
  height: calc(100vh - 89px);
}

.info {
  height: 99%;
  padding: 4px 8px;
  background-color: #fafafa;
}

#outline {
  height: 99%;
  overflow: hidden;
  background-color: #fafafa;
}

#outline:hover {
  overflow: scroll;
}

#editor {
  border: none;
  height: calc(100vh - 36px);
}

#editor >>> .vditor-ir {
  flex-direction: column;
  height: 100%;
  overflow: auto;
}

#editor >>> .vditor-reset {
  height: auto;
  min-height: 100%;
  width: calc(100vw - 252px);
  padding: 12px 64px !important;
}

#editor >>> .vditor-reset:focus {
  background-color: #fff;
}

.note-aside {
  display: flex;
  flex-direction: column;
  width: 180px;
  min-width: 180px;
  background-color: #fafafa;
}

.save-icon {
  color: #f75353;
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
</style>
