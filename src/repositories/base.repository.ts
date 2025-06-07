export interface IBaseRepository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: any): Promise<T>;
  update(id: ID, data: any): Promise<T>;
  delete(id: ID): Promise<boolean>;
} 