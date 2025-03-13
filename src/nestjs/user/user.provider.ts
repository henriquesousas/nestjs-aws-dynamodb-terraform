import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { CreateUserUseCase } from '@core/user/application/usecases/create-user/create-user.usecase';
import { GetAllUsersUseCase } from '@core/user/application/usecases/get-user/get-all-users.usecase';
import { GetUserByIdUseCase } from '@core/user/application/usecases/get-user/get-user-by-id.usecase';
import { UpdateUserUseCase } from '@core/user/application/usecases/update/update-user.usecase';
import { UserRepository } from '@core/user/domain/user.repository';
import { DynamoUserRepository } from '@core/user/infrastructure/repository/dynamo/dynamo-user.repository';
import { LocalUserRepository } from '@core/user/infrastructure/repository/local/local_user.repository';
import { ConfigService } from '@nestjs/config';

export const AWS_SERVICES = {
  DYNAMODB_CLIENT: {
    provide: 'DYNAMO_DB_CLIENT',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return new DynamoDBClient({
        region: configService.get<string>('AWS_REGION'),
        endpoint: configService.get<string>('AWS_URL'),
        credentials: {
          accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID') ?? '',
          secretAccessKey:
            configService.get<string>('AWS_SECRET_ACCESS_KEY') ?? '',
        },
      });
    },
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
    inject: [AWS_SERVICES.DYNAMODB_CLIENT.provide, ConfigService],
    useFactory: (client: DynamoDBClient, configService: ConfigService) => {
      return new DynamoUserRepository(
        configService.get<string>('DYNAMO_TABLE_USERS') ?? '',
        client,
      );
    },
  },

  USER_REPOSITORY: {
    provide: 'UserRepository',
    useExisting: LocalUserRepository,
  },
};

export const USECASES = {
  CREATE_USER_USECASE: {
    provide: CreateUserUseCase,
    useFactory: (repository: UserRepository) => {
      return new CreateUserUseCase(repository);
    },
    inject: [REPOSITORIES.USER_REPOSITORY.provide],
  },

  GET_USER_BY_ID_USECASE: {
    provide: GetUserByIdUseCase,
    useFactory: (repository: UserRepository) => {
      return new GetUserByIdUseCase(repository);
    },
    inject: [REPOSITORIES.USER_REPOSITORY.provide],
  },

  GET_ALL_USERS_USECASE: {
    provide: GetAllUsersUseCase,
    useFactory: (repository: UserRepository) => {
      return new GetAllUsersUseCase(repository);
    },
    inject: [REPOSITORIES.USER_REPOSITORY.provide],
  },

  UPDATE_USERS_USECASE: {
    provide: UpdateUserUseCase,
    useFactory: (repository: UserRepository) => {
      return new UpdateUserUseCase(repository);
    },
    inject: [REPOSITORIES.USER_REPOSITORY.provide],
  },
};

export const USER_PROVIDERS = {
  REPOSITORIES,
  USECASES,
  AWS_SERVICES,
};
