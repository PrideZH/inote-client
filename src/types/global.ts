export interface PicbedConfig {
  owner: string;
  repo: string;
  path: string;
  accessToken: string;
}

export interface Token {
  token: string;
}

export interface Config {
  filterContent: string; // 文件目录过滤内容
  outlineCollapse: boolean; // 大纲栏是否折叠
}
