import { Post } from '@prisma/client';

/**
 * Interface cho thông tin bài viết public (hiển thị cho client)
 */
export interface IPostPublic {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  thumbnail: {
    id: number;
    url: string;
  } | null;
  categoryId: string;
  category?: {
    id: string;
    title: string;
    slug: string;
  };
  symbol: string | null;
  stock?: {
    symbol: string;
    name: string;
  } | null;
  author: {
    id: string;
    fullName: string;
  };
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface cho dữ liệu tạo mới bài viết
 */
export interface IPostCreate {
  title: string;
  description?: string | null;
  content?: string | null;
  thumbnailId?: number | null;
  categoryId: string;
  symbol?: string | null;
  userId: string;
  isPremium?: boolean;
}

/**
 * Interface cho dữ liệu cập nhật bài viết
 */
export interface IPostUpdate {
  title?: string;
  description?: string | null;
  content?: string | null;
  thumbnailId?: number | null;
  categoryId?: string;
  symbol?: string | null;
  isPremium?: boolean;
}

/**
 * Interface cho dữ liệu tìm kiếm bài viết
 */
export interface IPostQuery {
  categoryId?: string;
  symbol?: string;
  userId?: string;
  isPremium?: boolean;
  search?: string;
} 