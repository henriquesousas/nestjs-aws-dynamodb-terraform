import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { CreateUserUseCase } from '@core/user/application/usecases/create-user/create-user.usecase';
import { GetAllUsersUseCase } from '@core/user/application/usecases/get-user/get-all-users.usecase';
import { GetUserByIdUseCase } from '@core/user/application/usecases/get-user/get-user-by-id.usecase';
import { UserRepository } from '@core/user/domain/user.repository';
import { DynamoUserRepository } from '@core/user/infrastructure/repository/dynamo/dynamo-user.repository';
import { LocalUserRepository } from '@core/user/infrastructure/repository/local/local_user.repository';

//TODO: use env
export const AWS_SERVICES = {
  DYNAMODB_CLIENT: {
    provide: 'DYNAMO_DB_CLIENT',
    useFactory: () => {
      return new DynamoDBClient({
        region: 'local',
        endpoint: 'http://localhost:8000',
        credentials: {
          accessKeyId: 'fakeAccessKeyId',
          secretAccessKey: 'fakeSecretAccessKey',
        },
      });
    },
    // inject: [REPOSITORIES.DYNAMODB_USER_REPOSITORY.provide],
  },
};
export const REPOSITORIES = {
  LOCAL_USER_REPOSITORY: {
    provide: LocalUserRepository,
    useFactory: () => {
      return new LocalUserRepository();
    },
  },

  DYNAMODB_USER_REPOSITORY: {
    provide: DynamoUserRepository,
    inject: [AWS_SERVICES.DYNAMODB_CLIENT.provide],
    useFactory: (client: DynamoDBClient) => {
      return new DynamoUserRepository(client);
    },
  },
};
export const USECASES = {
  CREATE_USER_USECASE: {
    provide: CreateUserUseCase,
    useFactory: (repository: UserRepository) => {
      return new CreateUserUseCase(repository);
    },
    inject: [REPOSITORIES.DYNAMODB_USER_REPOSITORY.provide],
  },

  GET_USER_BY_ID_USECASE: {
    provide: GetUserByIdUseCase,
    useFactory: (repository: UserRepository) => {
      return new GetUserByIdUseCase(repository);
    },
    inject: [REPOSITORIES.DYNAMODB_USER_REPOSITORY.provide],
  },

  GET_ALL_USERS_USECASE: {
    provide: GetAllUsersUseCase,
    useFactory: (repository: UserRepository) => {
      return new GetAllUsersUseCase(repository);
    },
    inject: [REPOSITORIES.DYNAMODB_USER_REPOSITORY.provide],
  },
};

export const USER_PROVIDERS = {
  REPOSITORIES,
  USECASES,
  AWS_SERVICES,
};
