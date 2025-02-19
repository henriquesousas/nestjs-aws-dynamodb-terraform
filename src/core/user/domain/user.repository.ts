import { User, UserId } from './entities/user';

export interface UserFilter {
  userId?: string;
  email?: string;
}

export interface UserRepository {
  create(user: User): Promise<void>;
  update(user: User): Promise<boolean>;
  findBy(filter: UserFilter): Promise<User[]>;
  findAll(): Promise<User[]>;
}
