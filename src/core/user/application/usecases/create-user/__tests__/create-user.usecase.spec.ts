import { User } from '@core/user/domain/entities/user';
import { UserAlreadyExistException } from '@core/user/domain/exception/user-already-exist.exception';
import { EntityValidationException } from '@core/@shared/entity-validation.exception';
import { UserBuilder } from '@core/user/application/builder/user.builder';
import { UserRepository } from '@core/user/domain/user.repository';
import { CreateUserUseCase } from '../create-user.usecase';

let mockUserRepository: any;

type SutType = {
  repository: UserRepository;
  sut: CreateUserUseCase;
  userMock: User;
};

const makeSut = (): SutType => {
  const userMock = new UserBuilder({
    name: 'user1',
    email: 'user1@mail.com',
    password: '123456',
  }).build();

  const repository = mockUserRepository as UserRepository;
  const sut = new CreateUserUseCase(repository);
  return {
    repository,
    sut,
    userMock,
  };
};

describe('CrateUserUseCase Unit Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    mockUserRepository = {
      findBy: jest.fn(),
      create: jest.fn(),
    };
  });

  it('should create a new user', async () => {
    const { sut, userMock, repository } = makeSut();

    jest.spyOn(repository, 'findBy').mockReturnValueOnce(Promise.resolve([]));

    const result = await sut.execute({
      name: 'user1',
      email: 'user1@mail.com',
      password: '123456',
    });

    const user = result.asArray()[0];
    expect(result.isOk()).toBe(true);
    expect(user.props.name.value).toBe(userMock.props.name.value);
    expect(user.props.email.value).toBe(userMock.props.email.value);
    expect(user.props.password.value).toBe(userMock.props.password.value);
  });

  it('should return UserAlreadyExistException if user exist on database', async () => {
    const { userMock, repository, sut } = makeSut();

    jest
      .spyOn(repository, 'findBy')
      .mockReturnValueOnce(Promise.resolve([userMock]));

    const result = await sut.execute({
      name: userMock.props.name.value,
      email: userMock.props.email.value,
      password: userMock.props.password.value,
    });

    const [user, exception] = result.asArray();
    expect(result.isOk()).toBe(false);
    expect(result.isFail()).toBe(true);
    expect(user).toBeNull();
    expect(exception).toBeInstanceOf(UserAlreadyExistException);
    expect(exception.message).toBe('Usuário já cadastrada em nossa base');
  });

  it('should return EntityValidationException if user has error', async () => {
    const { repository, sut } = makeSut();

    const userMock = new UserBuilder({
      name: '',
      email: 'user1',
      password: '*',
    }).build();

    jest.spyOn(repository, 'findBy').mockReturnValueOnce(Promise.resolve([]));

    const result = await sut.execute({
      name: userMock.props.name.value,
      email: userMock.props.email.value,
      password: userMock.props.password.value,
    });

    const [user, exception] = result.asArray();
    expect(result.isOk()).toBe(false);
    expect(result.isFail()).toBe(true);
    expect(user).toBeNull();
    expect(exception).toBeInstanceOf(EntityValidationException);
    expect((exception as EntityValidationException).error).toEqual([
      {
        'Nome deve estar entre 5 e 100 caracteres': [
          'Nome deve estar entre 5 e 100 caracteres',
        ],
      },
      {
        email: ['Email inválido'],
      },
      {
        password: ['Senha deve estar entre 5 e 10 caracteres'],
      },
    ]);
  });
});
