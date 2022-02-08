import { UserInfo } from "@/types/user";
import { Ref } from "vue";

export interface UserState {
  userInfo: Ref<UserInfo | null>;
}
