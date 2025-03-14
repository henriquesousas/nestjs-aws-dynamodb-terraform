import { Result } from '@core/@shared/result';
import { UseCaseWithNoInput } from '@core/@shared/usecase';
import { UserRepository } from '@core/user/domain/user.repository';
import { User } from '@core/user/domain/entities/user';

export class GetAllUsersUseCase implements UseCaseWithNoInput<User[]> {
  constructor(private readonly repository: UserRepository) {}

  async execute(): Promise<Result<User[]>> {
    const users = await this.repository.findAll();
    return users.length < 1 ? Result.ok([]) : Result.ok(users);
  }
}
