
import axios from "axios";

export interface GiteeImg {
  name: string;
  imgUrl: string;
}

export default class Gitee {

  private static GITEE_IMG_BASE: string = 'https://gitee.com/pridezh/picbed/raw/master/${path}/';

  // https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoGitTreesSha
  private static GET_TREE: string = 'https://gitee.com/api/v5/repos/{owner}/{repo}/git/trees/master';

  private strFormat(str: string, args: object) {
    for (const [key, val] of Object.entries(args)) {
      const reg = new RegExp('({' + key + '})', 'g');
      str = str.replace(reg, val);
    }
    return str;
  }

  async getJpgs(owner: string, repo: string, path: string, params: { access_token: string, recursive?: number }): Promise<GiteeImg[]> {
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

    return axios.get<{
      sha: string;
      url: string;
      truncated: boolean;
      tree: Tree[];
    }>(this.strFormat(Gitee.GET_TREE, { owner, repo }), { params }).then(res => {
      const giteeImgs: GiteeImg[] = [];
      res.data.tree.forEach((item: Tree) => {
        const __pathItem = item.path.split('/');
        if (item.type === 'blob' && pathItem.length === __pathItem.length - 1) {
          const fileName = __pathItem[__pathItem.length - 1];
          if (['.jpg', '.png'].includes(fileName.substring(fileName.indexOf('.')))) {
            giteeImgs.push({
              name: fileName.substring(0, fileName.length - 4),
              imgUrl: `https://gitee.com/${owner}/${repo}/raw/master/${path}/${fileName}`
            });
          }
        }
      });
      return Promise.resolve(giteeImgs);
    }).catch(err => {
      return Promise.reject(err);
    });
  }

}
