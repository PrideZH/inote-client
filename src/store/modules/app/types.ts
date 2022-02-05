import { Ref } from "vue";

export interface AppState {
  isCollapse: Ref<boolean>; // 侧边栏是否收缩
  isLoad: Ref<boolean>; // 全局加载
  loadPercent: Ref<number>; // 加载百分比
}
