import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { User, UserId } from '../../../domain/entities/user';
import { UserFilter, UserRepository } from '../../../domain/user.repository';
import { AbstractDynamoDbService } from './abstract-dynamodb-service';
import { marshall } from '@aws-sdk/util-dynamodb';
import { UserOutputMapperDto } from '../user-output-mapper.dto';

export class DynamoUserRepository
  extends AbstractDynamoDbService<UserOutputMapperDto>
  implements UserRepository
{
  protected tableName: string;

  constructor(tableName: string, client: DynamoDBClient) {
    super(client);
    this.tableName = tableName;
  }

  async create(user: User): Promise<UserId> {
    await this.putItemCommand({
      id: user.props.userId?.value,
      name: user.props.name.value,
      email: user.props.email.value,
      password: user.props.password.value,
      createdAt: user.props.createdAt!.toISOString(),
      updatedAt: user.props.updatedAt!.toISOString(),
    });
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
    await this.updateItem(
      key,
      updateExpression,
      expressionAttributeNames,
      expressionAttributeValues,
    );
    return true;
  }

  async findBy(filter: UserFilter): Promise<User[]> {
    if (filter.userId) {
      const data = await this.getItemCommand({ id: filter.userId });
      if (data != null) {
        const user = UserOutputMapperDto.toDomain(data);
        return [user];
      }
    }

    if (filter.email) {
      const data = await this.queryCommand({
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: marshall({ ':email': filter.email }),
      });

      return data.flatMap((userOutput) => {
        const user = UserOutputMapperDto.toDomain(userOutput);
        return user ? [user] : [];
      });
    }

    return [];
  }

  async findAll(): Promise<User[]> {
    const outputs = await this.scanCommand();
    return outputs.flatMap((userOutput) => {
      const user = UserOutputMapperDto.toDomain(userOutput);
      return user ? [user] : [];
    });
  }
}
