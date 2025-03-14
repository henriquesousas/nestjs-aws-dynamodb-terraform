import { User } from '@core/user/domain/entities/user';
import { UserOutputDto } from './dtos/user-output.dto';

export class UserPresenter {
  static fromUser(user: User): UserOutputDto {
    return {
      id: user.props.userId!.value,
      name: user.props.name.value,
      email: user.props.email.value,
      createdAt: user.props.createdAt!.toISOString(),
      roles: Object.values(user.props.roles!),
    };
  }

  static fromUsers(users: User[]): UserOutputDto[] {
    return users.map((u) => UserPresenter.fromUser(u));
  }
}
