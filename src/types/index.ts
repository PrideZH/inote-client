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

export interface Folder extends BaseEntity {
  name?: string;
  parentId?: number;
}

export interface FolderTree extends BaseEntity {
  name: string;
  children: FolderTree[];
}

export interface Note extends BaseEntity {
  name: string;
  content: string;
  article?: number;
}

export interface NotePage extends BaseEntity {
  name: string;
  article: ArticleInfoPage | null;
}

/**
 * 笔记栏数据
 */
export interface NoteFolderInfo extends BaseEntity {
  name: string;
  folderId: number;
  noteId: number;
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

export interface ArticleInfoPage extends BaseEntity {
  title: string;
  summary: string;
  close: boolean;
}

export interface TagPage extends BaseEntity {
  name: string;
  articleCount: number;
}
