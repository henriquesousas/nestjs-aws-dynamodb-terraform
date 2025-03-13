import { User, UserId } from '@core/user/domain/entities/user';
import { UserFilter, UserRepository } from '@core/user/domain/user.repository';

export class LocalUserRepository implements UserRepository {
  users: User[] = [];

  async create(user: User): Promise<UserId> {
    this.users.push(user);

    return Promise.resolve(user.props.userId!);
  }

  async update(user: User): Promise<boolean> {
    const userIndex = this.users.findIndex(
      (u) => u.props.userId == user.props.userId?.value,
    );
    if (userIndex === -1) return false;
    this.users[userIndex] = user;
    return Promise.resolve(false);
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

    return Promise.resolve([]);
  }

  async findById(userId: UserId): Promise<User | null> {
    const usr = this.users.find((u) => u.props.userId?.value == userId.value);
    return Promise.resolve(usr ?? null);
  }

  async findAll(): Promise<User[]> {
    return Promise.resolve(this.users);
  }
}
