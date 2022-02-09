export interface BaseEntity {
  id: number;
  createTime: Date;
  updateTime: Date;
}

export interface Folder extends BaseEntity {
  name?: string;
  parentId?: number;
}

export interface FolderTree extends BaseEntity {
  name?: string;
  children?: FolderTree[];
  notes?: NoteFolderInfo[];
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
  name?: string;
  noteId?: number;
}
