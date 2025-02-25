/* eslint-disable prettier/prettier */
import { UserBuilder } from '@core/user/application/builder/user.builder';
import { UserOutputDto } from '@core/user/application/usecases/user-output-dto';
import { User, UserId } from '@core/user/domain/entities/user';

export class UserOutputMapperDto extends UserOutputDto {
  id: string;

  static toDomain(data: UserOutputMapperDto): User {
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
