import { User, UserId } from '../../../domain/entities/user';
import { UserFilter, UserRepository } from '../../../domain/user.repository';
import { AwsDynamoDbRepository } from '../../../../@shared/aws/aws-dynamodb-repository';
import { marshall } from '@aws-sdk/util-dynamodb';
import { UserOutputDto } from '../user-output.dto';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export class DynamoUserRepository
  extends AwsDynamoDbRepository<UserOutputDto>
  implements UserRepository
{
  private ddbDocClient: DynamoDBDocumentClient;

  constructor(
    readonly tableName: string,
    readonly client: DynamoDBDocumentClient,
  ) {
    //USERS_DYNAMO_DB => esta na configuracao da stack na AWS
    // this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
    super(client, 'users');
    const ddbClient = new DynamoDBClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: '',
        secretAccessKey: '',
      },
    });
    this.ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
  }

  async create(user: User): Promise<UserId> {
    console.log(
      DynamoUserRepository.name,
      'Chamando comando de inserir no dynamo',
    );

    const item = {
      id: user.props.userId?.value,
      name: user.props.name.value,
      email: user.props.email.value,
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: item,
    });
    await this.ddbDocClient.send(command);

    // await this.putCommand({
    //   id: user.props.userId?.value,
    //   name: user.props.name.value,
    //   email: user.props.email.value,
    //   password: user.props.password.value,
    //   createdAt: user.props.createdAt!.toISOString(),
    //   updatedAt: user.props.updatedAt!.toISOString(),
    // });
    console.log(DynamoUserRepository.name, 'Criado usuário no dynamo');
    return user.props.userId!;
  }

  async update(user: User): Promise<boolean> {
    const key = { id: { S: user.props.userId!.value } };
    const updateExpression = 'set #name = :name';
    const expressionAttributeNames = {
      '#name': 'name',
    };
    const expressionAttributeValues = {
      ':name': { S: user.props.name.value },
    };
    await this.updateCommand(
      key,
      updateExpression,
      expressionAttributeNames,
      expressionAttributeValues,
    );
    return true;
  }

  async findBy(filter: UserFilter): Promise<User[]> {
    if (filter.userId) {
      const data = await this.getCommand({ id: filter.userId });
      if (data != null) {
        const user = UserOutputDto.toDomain(data);
        return [user];
      }
    }

    if (filter.email) {
      console.log(
        DynamoUserRepository.name,
        `Buscando usuario pelo email na tabela ${this.tableName} - ${JSON.stringify(filter)}`,
      );

      const data = await this.queryCommand({
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: marshall({ ':email': filter.email }),
      });

      console.log(
        DynamoUserRepository.name,
        `Resultado da consulta - ${JSON.stringify(data)}`,
      );

      return data.flatMap((userOutput) => {
        const user = UserOutputDto.toDomain(userOutput);
        return user ? [user] : [];
      });
    }

    return [];
  }

  async findById(userId: UserId): Promise<User | null> {
    const data = await this.getCommand({ id: userId.value });

    if (data != null) {
      return UserOutputDto.toDomain(data);
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    const data = await this.scanCommand();
    return data.map((userOutput) => UserOutputDto.toDomain(userOutput));
  }
}
