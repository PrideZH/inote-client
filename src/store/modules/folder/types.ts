import { FolderTree } from "@/types";
import { Ref } from "vue";

export interface FolderState {
  folderTree: Ref<FolderTree[]>;
  defaultExpandedKeys: number[]; // 展开的节点
  getFolderById: Function;
  addFolderTree: Function; // 添加文件夹节点
  setFolderTree: Function;
  delFolderTree: Function;
}
