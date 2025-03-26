/* eslint-disable @typescript-eslint/no-unused-vars */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocument,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';
import { CreateUserUseCase } from '@core/user/application/usecases/create-user/create-user.usecase';
import { GetAllUsersUseCase } from '@core/user/application/usecases/get-user/get-all-users.usecase';
import { GetUserByIdUseCase } from '@core/user/application/usecases/get-user/get-user-by-id.usecase';
import { UpdateUserUseCase } from '@core/user/application/usecases/update/update-user.usecase';
import { UserRepository } from '@core/user/domain/user.repository';
import { DynamoUserRepository } from '@core/user/infrastructure/repository/dynamo/dynamo-user.repository';
import { LocalUserRepository } from '@core/user/infrastructure/repository/local/local_user.repository';
import { ConfigService } from '@nestjs/config';

/**AWS tem duas maneiras de se conectar com o Dynamo, de preferencia na implementacao do DYNAMODB_DOCUMENT_CLIENT*/
export const AWS_SERVICES = {
  DYNAMODB_DOCUMENT_CLIENT: {
    provide: 'DYNAMODB_DOCUMENT_CLIENT',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const client = new DynamoDBClient({
        endpoint: configService.get<string>('AWS_URL') ?? '',
        region: configService.get<string>('AWS_REGION') ?? '',
        credentials: {
          accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID') ?? '',
          secretAccessKey:
            configService.get<string>('AWS_SECRET_ACCESS_KEY') ?? '',
        },
      });
      return DynamoDBDocument.from(client);
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
    inject: [AWS_SERVICES.DYNAMODB_DOCUMENT_CLIENT.provide, ConfigService],
    useFactory: (
      client: DynamoDBDocumentClient,
      configService: ConfigService,
    ) => {
      // ou process.env.USERS_DYNAMO_DB  é o nome da table que foi criado na stack do dynamo
      // configService.get<string>('DYNAMO_TABLE_USERS') ?? '',
      // process.env.USERS_DYNAMO_DB ?? from AWS CDK
      return new DynamoUserRepository(
        configService.get<string>('DYNAMO_TABLE_USERS') ?? '',
        client,
      );
    },
  },

  USER_REPOSITORY: {
    provide: 'UserRepository',
    useExisting: DynamoUserRepository,
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
