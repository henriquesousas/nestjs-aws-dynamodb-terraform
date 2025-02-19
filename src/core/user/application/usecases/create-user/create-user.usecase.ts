import { UseCase } from '@core/@shared/usecase';
import { UserRepository } from '@core/user/domain/user.repository';
import { User } from '@core/user/domain/entities/user';
import { Result } from '@core/@shared/result';
import { UserAlreadyExistException } from '@core/user/domain/exception/user-already-exist.exception';
import { EntityValidationException } from '@core/@shared/entity-validation.exception';
import { UserBuilder } from '@core/user/application/builder/user.builder';

export class CreateUserInputDto {
  name: string;
  email: string;
  password: string;
}

export class CreateUserUseCase implements UseCase<CreateUserInputDto, User> {
  constructor(private readonly repository: UserRepository) {}

  async execute(dto: CreateUserInputDto): Promise<Result<User>> {
    const user = await this.repository.findBy({
      email: dto.email,
    });

    if (user.length > 0) {
      return Result.fail(new UserAlreadyExistException());
    }

    const newuser = new UserBuilder({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    }).build();

    if (newuser.notification.hasErrors()) {
      const error = newuser.notification.toJSON();
      return Result.fail(new EntityValidationException(error));
    }

    await this.repository.create(newuser);
    return Result.ok(newuser);
  }
}
