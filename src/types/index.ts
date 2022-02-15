export interface BaseEntity {
  id: number;
  createTime: Date;
  updateTime: Date;
}

export interface Page<T> {
  records: T[];
  total: number;
  pages: number;
}

export interface UserPage extends BaseEntity {
  nickname: string;
  avatarUrl: string;
}

// 目录数据
export interface DirectoryNode extends BaseEntity {
  dirId: string;
  name: string;
  parentId: number;
  noteId?: number;
  note: boolean;
  children?: DirectoryNode[]
}

export interface Folder extends BaseEntity {
  name?: string;
  parentId?: number;
}

export interface Note extends BaseEntity {
  name: string;
  content: string;
  articleId: number | null;
}

export interface NotePage extends BaseEntity {
  name: string;
  article: ArticleInfoPage | null;
}

export interface ArticleOpen extends BaseEntity {
  content: string;
  summary: string;
  tagNames: string[];
  title: string;
}

export interface ArticlePage extends BaseEntity {
  title: string;
  summary: string | null;
  coverUrl: string | null;
  tagNames: string[];
  likeCount: number;
  author: UserPage;
}

export interface ArticleInfo extends BaseEntity {
  title: string;
  content: string;
  summary: string;
  close: boolean;
  coverUrl: string | null;
  tagNames: string[];
}

export interface ArticleInfoPage extends BaseEntity {
  title: string;
  summary: string;
  close: boolean;
}

export interface TagPage extends BaseEntity {
  name: string;
  articleCount: number;
}
