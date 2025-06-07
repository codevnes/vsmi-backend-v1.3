import { UserRepository } from './user.repository';
import { CategoryRepository } from './category.repository';
import { PostRepository } from './post.repository';
import { ImageRepository } from './image.repository';
import { SelectedStocksRepository } from './selectedStocks.repository';

// Export instances
const userRepository = new UserRepository();
const categoryRepository = new CategoryRepository();
const postRepository = new PostRepository();
const imageRepository = new ImageRepository();
const selectedStocksRepository = new SelectedStocksRepository();

export {
  userRepository,
  categoryRepository,
  postRepository,
  imageRepository,
  selectedStocksRepository
};

// Export classes
export * from './user.repository';
export * from './category.repository';
export * from './image.repository';
export * from './post.repository';
export * from './base.repository'; 