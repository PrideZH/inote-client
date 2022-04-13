import Vditor from 'vditor';
import { ArticleInfo, BaseEntity, DirectoryNode, NotePage } from '@/types';
import { defineStore } from 'pinia';
import { computed, nextTick, ref } from 'vue';
import { folderApi, noteApi } from '@/api';
import Gitee from '@/utils/gitee';
import { ElMessage, ElMessageBox } from 'element-plus';
import { PicbedConfig } from '@/types/global';
import { StringUtil } from '@/utils/StringUtil';
import { getToken } from '@/utils/auth';

export interface PathItem extends BaseEntity {
  name: string;

  type: 'note' | 'folder',

  // note
  content?: string;
  article: ArticleInfo | null;

  // folder
  parentId?: number;
  children?: DirectoryNode[];
}

// 保存打开的项目相关信息
export const usePathStore = defineStore('path', () => {

  // 当前打开的项目
  const pathItems = ref<PathItem[]>([]);
  // 正在浏览的项目 即最后一个项目
  const pathItem = computed(() => {
    return pathItems.value.length === 0 ? null : pathItems.value[pathItems.value.length - 1];
  });

  // 链接点击事件
  const __linkClickEvent = (e: Event) => {
    let ele: Element = e.target as Element;
    // 链接不在编辑状态下
    if (!(ele.parentNode as Element).classList.contains('vditor-ir__node--expand')) {
      const link: string = ele.nextElementSibling?.nextElementSibling?.nextElementSibling?.innerHTML as string;
      const host: string = window.location.host;
      if (link.indexOf(host) === 0) {
        const pathAndParm: string[] = link.substring(link.indexOf(host) + host.length).split('?');
        if (pathAndParm[1] === undefined) {
          return;
        }
        const parms: string[] = pathAndParm[1].split('=');
        if (parms[0] !== 'n') {
          return;
        }
        const id = parms[1];
        if (pathAndParm[0] === '/link') {
          openItem('note' ,Number(id), false);
          e.stopPropagation();
        }
      }
    }
  };
  // 异步获取补齐文件跳转链接
  const __getNoteLinks = (query: string) => {
    let result: {value: string, html: string}[] = [];
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4 || xhr.status !== 200) {
        return;
      }
      const res = JSON.parse(xhr.responseText);
      result = res.data.records.map((note: NotePage) => ({
        html: `${note.name} - inote_${note.id}`, value: `[${note.name}](${window.location.host}/link?n=${note.id})`
      }));
    };
    xhr.open('get', `${import.meta.env.VITE_APP_BASE_URL}/api/note?size=100&page=1&keyword=${query}`, false);
    xhr.setRequestHeader('token', getToken());
    xhr.send(null);
    return result;
  }
  // 打开项目
  const __openItem = (item: PathItem) => {
    // 标签页名称
    document.title = item.name;
    // 修改url
    const newUrl = window.location.pathname + (item.id !== 0 ? `?type=${item.type}&n=${item.id}` : '');
    window.history.replaceState('', '', newUrl);

    if (item.type === 'note') {
      nextTick(() => {
        document.getElementsByClassName('vditor-ir')[0].prepend(document.getElementById('item-info') as Node);
      });
      // 修改编辑器内容
      if (editor.value !== null) {
        editor.value.setValue(item.content as string, true);
      }
      isAlter.value = false;
      // 渲染笔记中的链接
      nextTick(() => __renderVditorLink());
    } else if (item.type === 'folder') {
      document.getElementsByClassName('note-container')[0].append(document.getElementById('item-info') as Node);
    }
  }

  /**
   * 打开指定项目
   * @param isCover 是否覆盖笔记链接路径
   */
   const openItem = (itemType: 'note' | 'folder', id: number, isCover: boolean = true) => {
    // 保存当前笔记
    saveCurrentNote();

    // 判断是否存在于链接路径中 若存在则返回该路径位置
    if (!isCover) {
      if (pathItem.value && pathItem.value.type === itemType && pathItem.value.id === id) return;
      let isExist = false;
      for (let i = 0; i < pathItems.value.length; i++) {
        if (pathItems.value[i].type === itemType && pathItems.value[i].id === id) {
          pathItems.value.splice(i + 1, pathItems.value.length - i - 1);
          __openItem(pathItems.value[i]);
          return;
        }
      }
    } else {
      // 覆盖所有笔记
      pathItems.value.splice(0, pathItems.value.length);
    }

    if (itemType === 'note') {
      // 获取笔记数据
      noteApi.get(id).then(res => {
        const data: PathItem = {
          type: 'note',
          ...res.data
        };
        pathItems.value.push(data);
        __openItem(data);
      });
    } else if (itemType === 'folder') {
      if (id === 0) {
        const data: PathItem = {
          type: 'folder',
          name: '云文件',
          id: 0,
          children: [],
          article: null,
          createTime: new Date(),
          updateTime: new Date()
        }
        pathItems.value.push(data);
        __openItem(data);
        folderApi.getDirectory(id).then(res => {
          if (!pathItem.value) return;
          for (let i = 0; i < res.data.length; i++) {
            pathItem.value.children?.push(res.data[i]);
          }
        });
        return;
      }

      // 获取文件夹数据
      folderApi.get(id).then(res => {
        const data: PathItem = {
          type: 'folder',
          ...res.data,
          children: [],
          article: null
        };
        pathItems.value.push(data);
        __openItem(data);
        folderApi.getDirectory(id).then(res => {
          if (!pathItem.value) return;
          for (let i = 0; i < res.data.length; i++) {
            pathItem.value.children?.push(res.data[i]);
          }
        });
      });
    }
  }

  /**
   * 笔记
   */
  const editor = ref<Vditor | null>(null); // 编辑器
  const isAlter = ref<boolean>(false); // 是否被修改
  // 保存当前笔记
  const saveCurrentNote = () => {
    if (!pathItem.value) return;
    if (pathItem.value !== null && pathItem.value.type === 'note' && isAlter.value) {
      pathItem.value.content = editor.value?.getValue() as string;
      noteApi.set(pathItem.value.id, { content: editor.value?.getValue() }).then(res => {
        isAlter.value = false;
      });
    }
  };

  // 渲染笔记跳转链接
  const __renderVditorLink = () => {
    const linkElements: any = document.getElementsByClassName('vditor-ir__link');
    for (let i = 0; i < linkElements.length; i++) {
      const linkElement: HTMLElement = linkElements[i];
      linkElement.onclick = __linkClickEvent;
    }
  };
  // 渲染大纲
  const __renderOutline = () => {

  }

  const __createEditor = (value: string | null) => {
    editor.value = new Vditor('editor', {
      value: value ? value : '',
      cache: {
        enable: false // 关闭缓存
      },
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
          if (editor.value === null) {
            return '';
          }

          const textBackup = editor.value.getValue();

          const placeholderStr = '<<图片上传中...>>';
          editor.value.insertValue(placeholderStr)
          editor.value.disabled()

          const file = files[0];
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function(ev) {
            if (ev.target === null) return;
            const base64 = (this.result as string).replace(/^data:image\/\w+;base64,/, '')
            // 上传图片
            ElMessageBox.prompt('输入文件名').then(res => {
              if (editor.value === null) {
                return Promise.resolve('编辑器丢失');
              }

              const fileName = res.value;
              Gitee.addImg(picbedConfig.owner, picbedConfig.repo, picbedConfig.path, fileName,
                  { content: base64, message: 'inote commit', access_token: picbedConfig.accessToken }).then(res => {
                // 插入图片地址
                if (editor.value !== null) {
                  const path: string = `\n\n![${fileName}](${res.data.content.download_url})\n\n`;
                  let textStr = editor.value.getValue();
                  textStr = textStr.replace(placeholderStr, path);
                  editor.value.setValue(textStr);

                  editor.value.enable();

                  return `\n\n![${fileName}](${res.data.content.download_url})\n\n`;
                }
              }).catch(err => {
                if (editor.value === null) {
                  return '';
                }
                ElMessage.error('图床配置错误');
                editor.value.setValue(textBackup);
                editor.value.enable();
              });
            }).catch(() => {
              if (editor.value === null) {
                return '';
              }
              editor.value.setValue(textBackup);
              editor.value.enable();
            })
          }
          return '';
        }
      },
      input: () => inputCallback(),
      after: () => {
        // 设置项目信息位置
        if (!StringUtil.isBlank(value)) {
          document.getElementsByClassName('vditor-ir')[0].prepend(document.getElementById('item-info') as Node);
        }
        // 渲染笔记中的链接
        nextTick(() => __renderVditorLink());
      },
      hint: {
        extend: [
          {
            key: '@',
            hint: (key) => {
              if (key === '') return [];
              return __getNoteLinks(key);
            },
          }
        ]
      }
    });
  }

  /**
   * 初始化编辑器以及打开项目
   */
  const init = (type: ('note' | 'folder') | null, id: number | null) => {
    // 默认打开根文件夹
    if (type === null || id === null) {
      __createEditor('');
      openItem('folder', 0);
      return;
    }

    if (type === 'note') {
      // 获取打开笔记数据
      noteApi.get(id).then(res => {
        // 初始化编辑器
        __createEditor(res.data.content);
        // 修改当前笔记为打开笔记
        const data: PathItem = {
          type: 'note',
          ...res.data
        }
        pathItems.value.push(data);
        // 标签页名称
        document.title = res.data.name;
      });
    } else if (type === 'folder') {
      __createEditor('');
      openItem('folder', id);
    }
  }

  // 输入回调
  const inputCallback = () => {
    isAlter.value = true;

    __renderVditorLink();
    __renderOutline();
  }

  return { pathItems, pathItem, editor, isAlter, saveCurrentNote, init, openItem, inputCallback }
});
