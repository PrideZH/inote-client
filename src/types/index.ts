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

// 目录数据
export interface DirectoryNode {
  id: number;
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
  id: number;
  content: string;
  summary: string;
  tagNames: string[];
  title: string;
}

export interface ArticlePage extends BaseEntity {
  title: string;
  summary?: string;
  coverUrl?: string;
  author: {
    nickname: string;
  }
}

export interface ArticleInfo extends BaseEntity {
  title: string;
  summary: string;
  close: boolean;
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
