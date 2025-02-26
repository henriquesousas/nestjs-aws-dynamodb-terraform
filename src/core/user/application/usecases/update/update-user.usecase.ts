import { UseCase } from '@core/@shared/usecase';
import { UserRepository } from '@core/user/domain/user.repository';
import { Result } from '@core/@shared/result';
import { EntityValidationException } from '@core/@shared/entity-validation.exception';
import { UserNotFoundException } from '@core/user/domain/exception/user-not-found.exception';

export class UpdateUserInputDto {
  userId: string;
  name: string;
}

export class UpdateUserUseCase implements UseCase<UpdateUserInputDto, boolean> {
  constructor(private readonly repository: UserRepository) {}

  async execute({
    userId,
    name,
  }: UpdateUserInputDto): Promise<Result<boolean>> {
    const users = await this.repository.findBy({
      userId: userId,
    });

    if (users.length < 0) return Result.fail(new UserNotFoundException());

    const user = users[0];
    user.changeName(name);

    if (user.notification.hasErrors()) {
      const error = user.notification.toJSON();
      return Result.fail(new EntityValidationException(error));
    }

    await this.repository.update(users[0]);
    return Result.ok(true);
  }
}
