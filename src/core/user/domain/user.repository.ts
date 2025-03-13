import { User, UserId } from './entities/user';

export interface UserFilter {
  userId?: string;
  email?: string;
}

export interface UserRepository {
  create(user: User): Promise<UserId>;
  update(user: User): Promise<boolean>;
  findBy(filter: UserFilter): Promise<User[]>;
  findById(userId: UserId): Promise<User | null>;
  findAll(): Promise<User[]>;
}
