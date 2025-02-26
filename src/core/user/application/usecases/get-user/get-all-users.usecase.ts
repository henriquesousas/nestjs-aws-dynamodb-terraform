import { Result } from '@core/@shared/result';
import { UseCaseWithNoInput } from '@core/@shared/usecase';
import { UserRepository } from '@core/user/domain/user.repository';
import { UserOutputDto } from '../user-output-dto';

export class GetAllUsersUseCase implements UseCaseWithNoInput<UserOutputDto[]> {
  constructor(private readonly repository: UserRepository) {}

  async execute(): Promise<Result<UserOutputDto[]>> {
    const users = await this.repository.findAll();

    if (users.length < 1) return Result.ok([]);

    const data = users.map((u) => {
      return {
        name: u.props.name.value,
        email: u.props.email.value,
        password: u.props.password.value,
        createdAt: u.props.createdAt!,
        isActive: u.props.isActive ?? true,
      } as UserOutputDto;
    });
    return Result.ok(data);
  }
}
