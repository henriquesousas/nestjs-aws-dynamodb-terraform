import { UserRepository } from '@core/user/domain/user.repository';
import { GetUserByIdUseCase } from '../get-user-by-id.usecase';
import { User } from '@core/user/domain/entities/user';
import { UserBuilder } from '@core/user/application/builder/user.builder';
import { EntityValidationException } from '@core/@shared/entity-validation.exception';

let mockUserRepository: any;

type SutType = {
  repository: UserRepository;
  sut: GetUserByIdUseCase;
  userMock: User;
};

const makeSut = (): SutType => {
  const userMock = new UserBuilder({
    name: 'user1',
    email: 'user1@mail.com',
    password: '123456',
  }).build();

  const repository = mockUserRepository as UserRepository;
  const sut = new GetUserByIdUseCase(repository);
  return {
    repository,
    sut,
    userMock,
  };
};

describe('GetUserByIdUseCase Unit Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
    };
  });

  it('should return EntityValidationException if invalid id', async () => {
    const { sut, repository } = makeSut();

    jest
      .spyOn(repository, 'findById')
      .mockReturnValueOnce(Promise.resolve(null));

    const result = await sut.execute({
      userId: 'a7',
    });

    const [user, exception] = result.asArray();
    expect(result.isOk()).toBe(false);
    expect(result.isFail()).toBe(true);
    expect(user).toBeNull();
    expect(exception).toBeInstanceOf(EntityValidationException);
    expect((exception as EntityValidationException).error).toEqual([
      'ID deve ser um UUID válido',
    ]);
  });

  it('should return an user', async () => {
    const { sut, repository, userMock } = makeSut();

    jest
      .spyOn(repository, 'findById')
      .mockReturnValueOnce(Promise.resolve(userMock));

    const result = await sut.execute({
      userId: userMock.props.userId?.value,
    });

    const [user] = result.asArray();
    expect(result.isOk()).toBe(true);
    expect(user.name).toEqual(userMock.props.name.value);
  });
});
