import { NoteFolderInfo, Note } from "@/types";
import Vditor from "vditor";
import { Ref } from "vue";

export interface NoteState {
  editor: Vditor | null; // 编辑器
  notes: Ref<NoteFolderInfo[]>; // 笔记栏数据
  currentNote: Ref<Note[]>;
  isAlter: boolean; // 笔记是否发生修改
  showNotes: Function; // 显示指定文件夹下的所有笔记
  addNote: Function;
}
