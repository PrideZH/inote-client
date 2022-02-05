export interface BaseEntity {
  id?: number;
  createTime?: Date;
  updateTime?: Date;
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

/**
 * 笔记栏数据
 */
export interface NoteFolderInfo extends BaseEntity {
  name?: string;
  noteId?: number;
}
