
import axios from "axios";

export interface GiteeImg {
  name: string;
  path: string;
  imgUrl: string;
  sha: string;
}

export default class Gitee {

  private static GITEE_IMG_BASE: string = 'https://gitee.com/pridezh/picbed/raw/master/${path}/';

  static async getJpgs(owner: string, repo: string, path: string, params: { access_token: string, recursive?: number }): Promise<GiteeImg[]> {
    if (params.recursive === undefined) params.recursive = 1; // 递归获取目录
    const pathItem = path.split('/');

    interface Tree {
      path: string;
      mode: string;
      type: 'tree' | 'blob';
      sha: string;
      size: number;
      url: string;
    }

    // https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoGitTreesSha
    return axios.get<{
      sha: string;
      url: string;
      truncated: boolean;
      tree: Tree[];
    }>(`https://gitee.com/api/v5/repos/${owner}/${repo}/git/trees/master`, { params }).then(res => {
      const giteeImgs: GiteeImg[] = [];
      res.data.tree.forEach((item: Tree) => {
        const __pathItem = item.path.split('/');
        if (item.type === 'blob' && pathItem.length === __pathItem.length - 1) {
          const fileName = __pathItem[__pathItem.length - 1];
          if (['.jpg', '.png'].includes(fileName.substring(fileName.indexOf('.')))) {
            giteeImgs.push({
              name: fileName.substring(0, fileName.length - 4),
              path: item.path,
              imgUrl: `https://gitee.com/${owner}/${repo}/raw/master/${path}/${fileName}`,
              sha: item.sha
            });
          }
        }
      });
      return Promise.resolve(giteeImgs);
    }).catch(err => {
      return Promise.reject(err);
    });
  }

  static async addImg(owner: string, repo: string, path: string, name: string,
      params: {content: string, message: string, access_token: string}) {
    name += '.jpg';
    return axios.post(`https://gitee.com/api/v5/repos/${owner}/${repo}/contents/${path}/${name}`, params);
  }

  static async delImg(owner: string, repo: string, path: string,
      params: { sha: string, message: string, access_token: string }) {
    return axios.delete(`https://gitee.com/api/v5/repos/${owner}/${repo}/contents/${path}`, { params });
  }

}
