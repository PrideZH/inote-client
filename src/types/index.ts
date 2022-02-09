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
  name?: string;
  content?: string;
  publicNoteId?: number;
}

/**
 * 笔记栏数据
 */
export interface NoteFolderInfo extends BaseEntity {
  name: string;
  folderId: number;
  noteId: number;
}

export interface ArticlePage extends BaseEntity {
  title: string,
  summary?: string,
  coverUrl?: string,
  author: {
    nickname: string
  }
}
