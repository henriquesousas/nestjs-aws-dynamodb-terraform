import { UserBuilder } from '@core/user/application/builder/user.builder';
import { User, UserId } from '@core/user/domain/entities/user';

export class UserOutputDto {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  id: string;

  static toDomain(data: UserOutputDto): User {
    return new UserBuilder({
      name: data.name,
      email: data.email,
      password: data.password,
    })
      .withCreatedAt(new Date(data.createdAt))
      .withUserId(new UserId(data.id))
      .build();
  }
}
