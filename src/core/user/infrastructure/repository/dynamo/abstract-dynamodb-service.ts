import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

export abstract class AbstractDynamoDbService<T = any> {
  protected abstract tableName: string;

  constructor(private readonly client: DynamoDBClient) {}

  async putItemCommand(item: Record<string, any>): Promise<void> {
    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: marshall(item),
    });
    await this.client.send(command);
  }

  async updateItem(
    key: { [key: string]: any },
    updateExpression: string,
    expressionAttributeNames: { [key: string]: string },
    expressionAttributeValues: { [key: string]: any },
  ) {
    const params: UpdateItemCommandInput = {
      TableName: this.tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'UPDATED_NEW',
    };

    const result = await this.client.send(new UpdateItemCommand(params));
    return result.Attributes;
  }

  async scanCommand(params?: ScanCommandInput): Promise<T[]> {
    const command = new ScanCommand({ ...params, TableName: this.tableName });
    const response = await this.client.send(command);
    return response.Items
      ? response.Items.map((item) => unmarshall(item) as T)
      : [];
  }

  async queryCommand(
    input: Omit<QueryCommandInput, 'TableName'>,
  ): Promise<T[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      ...input,
    });
    const response = await this.client.send(command);
    return response.Items
      ? response.Items.map((item) => unmarshall(item) as T)
      : [];
  }

  async getItemCommand(key: Record<string, any>): Promise<T | null> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall(key),
    });
    const { Item } = await this.client.send(command);

    return Item ? (unmarshall(Item) as T) : null;
  }
}
