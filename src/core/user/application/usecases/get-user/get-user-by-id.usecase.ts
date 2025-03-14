import { Result } from '@core/@shared/result';
import { UseCase } from '@core/@shared/usecase';
import { User, UserId } from '@core/user/domain/entities/user';
import { UserFilter, UserRepository } from '@core/user/domain/user.repository';
import { EntityValidationException } from '@core/@shared/entity-validation.exception';
import { UserNotFoundException } from '@core/user/domain/exception/user-not-found.exception';

export class GetUserByIdUseCase implements UseCase<UserFilter, User> {
  constructor(private readonly repository: UserRepository) {}

  async execute(filter: UserFilter): Promise<Result<User>> {
    const userId = new UserId(filter.userId);
    if (userId.domainNotification.hasErrors()) {
      return Result.fail(
        new EntityValidationException(userId.domainNotification.toJSON()),
      );
    }
    const user = await this.repository.findById(new UserId(userId.value));

    if (!user) {
      return Result.fail(new UserNotFoundException());
    }

    return Result.ok(user);
  }
}
