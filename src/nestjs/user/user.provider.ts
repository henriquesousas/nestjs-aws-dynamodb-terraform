import { CreateUserUseCase } from '@core/user/application/usecases/create-user/create-user.usecase';
import { GetUserByIdUseCase } from '@core/user/application/usecases/get-user/get-user-by-id.usecase';
import { UserRepository } from '@core/user/domain/user.repository';
import { LocalUserRepository } from '@core/user/infrastructure/repository/local_user.repository';

export const REPOSITORIES = {
  LOCAL_USER_REPOSITORY: {
    provide: LocalUserRepository,
    useFactory: () => {
      return new LocalUserRepository();
    },
    inject: [],
  },
};

export const USECASES = {
  CREATE_USER_USECASE: {
    provide: CreateUserUseCase,
    useFactory: (repository: UserRepository) => {
      return new CreateUserUseCase(repository);
    },
    inject: [REPOSITORIES.LOCAL_USER_REPOSITORY.provide],
  },

  GET_USER_BY_ID_USECASE: {
    provide: GetUserByIdUseCase,
    useFactory: (repository: UserRepository) => {
      return new GetUserByIdUseCase(repository);
    },
    inject: [REPOSITORIES.LOCAL_USER_REPOSITORY.provide],
  },
};

export const USER_PROVIDERS = {
  REPOSITORIES,
  USECASES,
};
