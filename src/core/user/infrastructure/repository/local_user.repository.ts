import { User, UserId } from '../../domain/entities/user';
import { UserFilter, UserRepository } from '../../domain/user.repository';

export class LocalUserRepository implements UserRepository {
  users: User[] = [];

  async create(user: User): Promise<UserId> {
    this.users.push(user);
    return user.props.userId!;
  }

  async update(user: User): Promise<boolean> {
    const userIndex = this.users.findIndex(
      (u) => u.props.userId == user.props.userId?.value,
    );
    if (userIndex === -1) return false;
    this.users[userIndex] = user;
    return false;
  }

  async findBy(filter: UserFilter): Promise<User[]> {
    if (filter.userId) {
      return this.users.filter(
        (user) => filter.userId == user.props.userId?.value,
      );
    }

    if (filter.email) {
      return this.users.filter(
        (user) => filter.email == user.props.email?.value,
      );
    }

    return [];
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }
}
