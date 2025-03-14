import { UseCase } from '@core/@shared/usecase';
import { UserRepository } from '@core/user/domain/user.repository';
import { Result } from '@core/@shared/result';
import { EntityValidationException } from '@core/@shared/entity-validation.exception';
import { UserNotFoundException } from '@core/user/domain/exception/user-not-found.exception';
import { UserId } from '@core/user/domain/entities/user';

export class UpdateUserInputDto {
  userId: string;
  name: string;
}

export class UpdateUserUseCase implements UseCase<UpdateUserInputDto, UserId> {
  constructor(private readonly repository: UserRepository) {}

  async execute({ userId, name }: UpdateUserInputDto): Promise<Result<UserId>> {
    const uuid = new UserId(userId);
    const user = await this.repository.findById(uuid);

    if (!user) return Result.fail(new UserNotFoundException());

    user.changeName(name);

    if (user.notification.hasErrors()) {
      const error = user.notification.toJSON();
      return Result.fail(new EntityValidationException(error));
    }

    //pode alterar a regra do update do repositorio caso sucesso retorne
    //o Userid, em caso de falha retorne -1
    await this.repository.update(user);
    return Result.ok(user.props.userId!);
  }
}
