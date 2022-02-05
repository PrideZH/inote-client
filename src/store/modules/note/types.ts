import { NoteFolderInfo } from "@/types";
import { Ref } from "vue";

export interface NoteState {
  notes: Ref<NoteFolderInfo[]>; // 笔记栏数据
  showNotes: Function; // 显示指定文件夹下的所有笔记
  //note: Ref<Note>;
}
