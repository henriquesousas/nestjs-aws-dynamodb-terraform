import { Result } from '@core/@shared/result';
import { UseCase } from '@core/@shared/usecase';
import { UserId } from '@core/user/domain/entities/user';
import { UserFilter, UserRepository } from '@core/user/domain/user.repository';
import { UserOutputDto } from '../user-output-dto';
import { EntityValidationException } from '@core/@shared/entity-validation.exception';
import { UserNotFoundException } from '@core/user/domain/exception/user-not-found.exception';

export class GetUserByIdUseCase implements UseCase<UserFilter, UserOutputDto> {
  constructor(private readonly repository: UserRepository) {}

  async execute(filter: UserFilter): Promise<Result<UserOutputDto>> {
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

    return Result.ok({
      name: user.props.name.value,
      email: user.props.email.value,
      password: user.props.password.value,
      createdAt: user.props.createdAt!,
      isActive: user.props.isActive!,
    });
  }
}
