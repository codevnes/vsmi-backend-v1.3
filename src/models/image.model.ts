export interface IImage {
  id: number;
  filename: string;
  processedFilename: string;
  path: string;
  url: string;
  altText: string | null;
  mimetype: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IImageCreate {
  filename: string;
  processedFilename: string;
  path: string;
  url: string;
  altText?: string | null;
  mimetype?: string | null;
  size?: number | null;
  width?: number | null;
  height?: number | null;
}

export interface IImageUpdate {
  altText?: string | null;
}

export interface IImagePublic {
  id: number;
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  createdAt: Date;
} 