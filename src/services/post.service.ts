import { 
  IPostCreate, 
  IPostUpdate, 
  IPostQuery, 
  IPaginationOptions, 
  IPaginationResult, 
  IPostPublic 
} from '../models';
import { postRepository, categoryRepository } from '../repositories';
import { prisma } from '../app';

export class PostService {
  /**
   * Lấy danh sách bài viết với phân trang
   */
  async getAllPosts(
    options: IPaginationOptions & IPostQuery
  ): Promise<IPaginationResult<IPostPublic>> {
    const result = await postRepository.findAllWithPagination(options);
    
    // Chuyển đổi sang định dạng public cho client
    return {
      data: result.data.map(post => this.toPublicPost(post)),
      pagination: result.pagination
    };
  }
  
  /**
   * Lấy bài viết theo ID
   */
  async getPostById(id: string): Promise<IPostPublic> {
    const post = await postRepository.findById(id);
    
    if (!post) {
      throw new Error('POST_NOT_FOUND');
    }
    
    return this.toPublicPost(post);
  }
  
  /**
   * Lấy bài viết theo slug
   */
  async getPostBySlug(slug: string): Promise<IPostPublic> {
    const post = await postRepository.findBySlug(slug);
    
    if (!post) {
      throw new Error('POST_NOT_FOUND');
    }
    
    return this.toPublicPost(post);
  }
  
  /**
   * Tạo bài viết mới
   */
  async createPost(data: IPostCreate): Promise<IPostPublic> {
    // Kiểm tra xem category có tồn tại không
    const category = await categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new Error('CATEGORY_NOT_FOUND');
    }
    
    // Kiểm tra xem stock có tồn tại không (nếu có)
    if (data.symbol) {
      const stock = await prisma.stock.findUnique({
        where: { symbol: data.symbol }
      });
      
      if (!stock) {
        throw new Error('STOCK_NOT_FOUND');
      }
    }
    
    // Kiểm tra xem hình ảnh có tồn tại không (nếu có)
    if (data.thumbnailId) {
      const image = await prisma.image.findUnique({
        where: { id: data.thumbnailId }
      });
      
      if (!image) {
        throw new Error('IMAGE_NOT_FOUND');
      }
    }
    
    // Tạo bài viết mới
    const post = await postRepository.create(data);
    
    return this.toPublicPost(post);
  }
  
  /**
   * Cập nhật bài viết
   */
  async updatePost(id: string, userId: string, data: IPostUpdate): Promise<IPostPublic> {
    // Kiểm tra xem bài viết có tồn tại không
    const existingPost = await postRepository.findById(id);
    if (!existingPost) {
      throw new Error('POST_NOT_FOUND');
    }
    
    // Kiểm tra quyền (người viết hoặc admin mới được cập nhật)
    if (existingPost.userId !== userId) {
      // Kiểm tra xem user có phải admin không
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user || user.role !== 'ADMIN') {
        throw new Error('UNAUTHORIZED');
      }
    }
    
    // Kiểm tra xem category có tồn tại không (nếu cập nhật)
    if (data.categoryId) {
      const category = await categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new Error('CATEGORY_NOT_FOUND');
      }
    }
    
    // Kiểm tra xem stock có tồn tại không (nếu cập nhật)
    if (data.symbol) {
      const stock = await prisma.stock.findUnique({
        where: { symbol: data.symbol }
      });
      
      if (!stock) {
        throw new Error('STOCK_NOT_FOUND');
      }
    }
    
    // Kiểm tra xem hình ảnh có tồn tại không (nếu cập nhật)
    if (data.thumbnailId) {
      const image = await prisma.image.findUnique({
        where: { id: data.thumbnailId }
      });
      
      if (!image) {
        throw new Error('IMAGE_NOT_FOUND');
      }
    }
    
    // Cập nhật bài viết
    const post = await postRepository.update(id, data);
    
    return this.toPublicPost(post);
  }
  
  /**
   * Xóa mềm bài viết
   */
  async softDeletePost(id: string, userId: string): Promise<boolean> {
    // Kiểm tra xem bài viết có tồn tại không
    const existingPost = await postRepository.findById(id);
    if (!existingPost) {
      throw new Error('POST_NOT_FOUND');
    }
    
    // Kiểm tra quyền (người viết hoặc admin mới được xóa)
    if (existingPost.userId !== userId) {
      // Kiểm tra xem user có phải admin không
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user || user.role !== 'ADMIN') {
        throw new Error('UNAUTHORIZED');
      }
    }
    
    // Xóa mềm bài viết
    return await postRepository.softDelete(id);
  }
  
  /**
   * Khôi phục bài viết đã xóa (chỉ admin mới được khôi phục)
   */
  async restorePost(id: string, userId: string): Promise<IPostPublic> {
    // Kiểm tra quyền admin
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user || user.role !== 'ADMIN') {
      throw new Error('UNAUTHORIZED');
    }
    
    // Kiểm tra xem bài viết có tồn tại không
    const existingPost = await prisma.post.findFirst({
      where: {
        id,
        deletedAt: { not: null }
      }
    });
    
    if (!existingPost) {
      throw new Error('POST_NOT_FOUND');
    }
    
    // Khôi phục bài viết
    const post = await postRepository.restore(id);
    
    return this.toPublicPost(post);
  }
  
  /**
   * Xóa vĩnh viễn bài viết (chỉ admin mới được xóa vĩnh viễn)
   */
  async deletePost(id: string, userId: string): Promise<boolean> {
    // Kiểm tra quyền admin
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user || user.role !== 'ADMIN') {
      throw new Error('UNAUTHORIZED');
    }
    
    // Kiểm tra xem bài viết có tồn tại không
    const existingPost = await postRepository.findById(id);
    if (!existingPost) {
      throw new Error('POST_NOT_FOUND');
    }
    
    // Xóa vĩnh viễn bài viết
    return await postRepository.delete(id);
  }
  
  /**
   * Chuyển đổi từ dữ liệu Prisma thành dữ liệu public cho client
   */
  private toPublicPost(post: any): IPostPublic {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      description: post.description,
      content: post.content,
      thumbnail: post.thumbnail ? {
        id: post.thumbnail.id,
        url: post.thumbnail.url
      } : null,
      categoryId: post.categoryId,
      category: post.category ? {
        id: post.category.id,
        title: post.category.title,
        slug: post.category.slug
      } : undefined,
      symbol: post.symbol,
      stock: post.stock ? {
        symbol: post.stock.symbol,
        name: post.stock.name
      } : null,
      author: {
        id: post.user.id,
        fullName: post.user.fullName
      },
      isPremium: post.isPremium,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    };
  }
} 