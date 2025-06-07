export interface ICategory {
  id: string;
  title: string;
  slug: string;
  thumbnailId: number | null;
  description: string | null;
  parentId: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryCreate {
  title: string;
  slug: string;
  thumbnailId?: number | null;
  description?: string | null;
  parentId?: string | null;
}

export interface ICategoryUpdate {
  title?: string;
  slug?: string;
  thumbnailId?: number | null;
  description?: string | null;
  parentId?: string | null;
}

export interface ICategoryPublic {
  id: string;
  title: string;
  slug: string;
  thumbnailId: number | null;
  description: string | null;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  children?: ICategoryPublic[];
} 