import { UserRepository } from '@core/user/domain/user.repository';
import { UserBuilder } from '@core/user/application/builder/user.builder';
import { GetAllUsersUseCase } from '../get-all-users.usecase';

let mockUserRepository: any;

type SutType = {
  repository: UserRepository;
  sut: GetAllUsersUseCase;
};

const userMock = new UserBuilder({
  name: 'user1',
  email: 'user1@mail.com',
  password: '123456',
}).build();

const makeSut = (): SutType => {
  const repository = mockUserRepository as UserRepository;
  const sut = new GetAllUsersUseCase(repository);
  return {
    repository,
    sut,
  };
};

describe('GetAllUsersUseCase Unit Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    mockUserRepository = {
      findAll: jest.fn(),
    };
  });

  it('should return empty when no users found', async () => {
    const { sut, repository } = makeSut();

    jest.spyOn(repository, 'findAll').mockReturnValueOnce(Promise.resolve([]));

    const result = await sut.execute();
    const [users] = result.asArray();
    expect(result.isOk()).toBe(true);
    expect(result.isFail()).toBe(false);
    expect(users.length).toBe(0);
  });

  it('should return an list of users output', async () => {
    const { sut, repository } = makeSut();

    const user1 = userMock;
    const user2 = userMock;

    jest
      .spyOn(repository, 'findAll')
      .mockReturnValueOnce(Promise.resolve([user1, user2]));

    const result = await sut.execute();
    const [users] = result.asArray();
    expect(users.length).toBe(2);
    expect(users[0].props.name.value).toBe(user1.props.name.value);
    expect(users[1].props.name.value).toBe(user2.props.name.value);
  });
});
