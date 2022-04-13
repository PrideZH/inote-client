<!-- <script setup lang="ts">
import Vditor from 'vditor';
import { nextTick, onMounted, ref } from 'vue';

import { ElMessage, ElMessageBox } from 'element-plus';

import { useDirStore } from '@/store';
import { StringUtil } from '@/utils/StringUtil';
import { getToken } from '@/utils/auth';
import Gitee from '@/utils/gitee';

import { PicbedConfig } from '@/types/global';
import { NotePage } from '@/types';

const noteStore = useDirStore();

const detailDrawer = ref<boolean>(false);

// 异步获取补齐文件跳转链接
const getNoteLinks = (query: string) => {
  let result: {value: string, html: string}[] = [];
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4 || xhr.status !== 200) {
      return;
    }
    const res = JSON.parse(xhr.responseText);
    result = res.data.records.map((note: NotePage) => ({
      html: `${note.name} - inote_${note.id}`, value: `[${note.name}](${window.location.host}/link?n=${note.id})\xa0`
    }));
  };
  xhr.open('get', `${import.meta.env.VITE_APP_BASE_URL}/api/note?size=100&page=1&keyword=${query}`, false);
  xhr.setRequestHeader('token', getToken());
  xhr.send(null);
  return result;
}

onMounted(() => {
  if (noteStore.editor !== null) return;
  noteStore.editor = new Vditor('editor', {
    height: '100%',
    value: noteStore.currentNote ? noteStore.currentNote.content : '',
    cache: {
      enable: false // 关闭缓存
    },
    toolbar: ['undo', 'redo', '|', 'headings', 'check', 'table', 'upload', '|', {
      name:'save',
      tipPosition: 's',
      tip: '保存',
      icon: '<svg t="1645794151145" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2063" width="200" height="200"><path d="M814.805 128a51.179 51.179 0 0 1 51.179 51.179V844.01a51.179 51.179 0 0 1-51.179 51.157H201.173a51.179 51.179 0 0 1-51.178-51.157V179.179A51.179 51.179 0 0 1 201.173 128h613.654zM329.024 434.837a51.093 51.093 0 0 1-51.179-51.093V179.157h-76.672v664.854h613.76V179.179H738.22v204.48a51.179 51.179 0 0 1-51.179 51.178H329.024z m0-51.093h357.995V179.157H329.024v204.587z m357.91 204.501a25.557 25.557 0 1 1 0.085 51.072H329.024a25.536 25.536 0 1 1 0-51.072h357.91z" fill="#333333" p-id="2064"></path></svg>',
      click () {
        noteStore.saveCurrentNote();
      }
    }],
    upload: {
      accept: 'image/*',
      multiple: false,
      handler: (files: File[]) => {
        const configJson: string | null = localStorage.getItem('picbed');
        const picbedConfig: PicbedConfig | null = configJson ? JSON.parse(configJson) : null;
        if (picbedConfig === null
          || StringUtil.isOrBlank(
            picbedConfig.owner,
            picbedConfig.repo,
            picbedConfig.path,
            picbedConfig.accessToken)
        ) {
          ElMessage.warning('未配置图床，请到“设置”中配置');
          return '';
        }
        if (noteStore.editor === null) {
          return '';
        }

        const textBackup = noteStore.editor.getValue();

        const placeholderStr = '<<图片上传中...>>';
        noteStore.editor.insertValue(placeholderStr)
        noteStore.editor.disabled()

        const file = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(ev) {
          if (ev.target === null) return;
          const base64 = (this.result as string).replace(/^data:image\/\w+;base64,/, '')
          // 上传图片
          ElMessageBox.prompt('输入文件名').then(res => {
            if (noteStore.editor === null) {
              return Promise.resolve('编辑器丢失');
            }

            const fileName = res.value;
            Gitee.addImg(picbedConfig.owner, picbedConfig.repo, picbedConfig.path, fileName,
                { content: base64, message: 'inote commit', access_token: picbedConfig.accessToken }).then(res => {
              // 插入图片地址
              if (noteStore.editor !== null) {
                const path: string = `\n\n![${fileName}](${res.data.content.download_url})\n\n`;
                let textStr = noteStore.editor.getValue();
                textStr = textStr.replace(placeholderStr, path);
                noteStore.editor.setValue(textStr);

                noteStore.editor.enable();

                return `\n\n![${fileName}](${res.data.content.download_url})\n\n`;
              }
            }).catch(err => {
              if (noteStore.editor === null) {
                return '';
              }
              ElMessage.error('图床配置错误');
              noteStore.editor.setValue(textBackup);
              noteStore.editor.enable();
            });
          }).catch(() => {
            if (noteStore.editor === null) {
              return '';
            }
            noteStore.editor.setValue(textBackup);
            noteStore.editor.enable();
          })
        }
        return '';
      }
    },
    outline: {
      enable: true,
      position: 'right'
    },
    input: () => noteStore.inputCallback(),
    after: () => {
      // 设置大纲到侧边栏下
      document.getElementById('outline')?.append(document.getElementsByClassName('vditor-outline')[0]);
    },
    hint: {
      extend: [
        {
          key: '@',
          hint: (key) => {
            if (key === '') return [];
            return getNoteLinks(key);
          },
        }
      ]
    }
  });
});
</script>

<template>
  <div class="edit-view">
    <div id="editor" />
    <el-drawer v-model="detailDrawer" direction="ltr" size="80%" :with-header="false">
      <div class="note-detail">
        <el-collapse accordion>
          <el-collapse-item v-if="noteStore.currentNote !== null" title="笔记信息" name="info">
            <div class="info">
              <div>笔记ID</div>
              <div>{{ noteStore.currentNote.name }}_inote_{{ noteStore.currentNote.id }}</div>
              <div>编辑时间</div>
              <div>{{ noteStore.currentNote.createTime }}</div>
              <div>修改时间</div>
              <div>{{ noteStore.currentNote.updateTime }}</div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="笔记大纲" name="outline">
            <div id="outline" />
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped>
.edit-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  height: 40px;
  border-bottom: 2px solid #ece7ed;
  box-sizing: border-box;
}

.note-detail {
  width: 200px;
  background-color: #fafafa;
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

.vditor-outline >>> .vditor-outline__title{
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

#editor {
  flex: 1;
  border: none;
  height: calc(100vh - 40px);
}

#editor >>> .vditor-reset {
  width: 100vw;
}
</style> -->
