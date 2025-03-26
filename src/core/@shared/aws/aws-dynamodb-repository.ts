import { UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

export abstract class AwsDynamoDbRepository<T = any> {
  constructor(
    protected readonly client: DynamoDBDocumentClient,
    protected readonly tableName: string,
  ) {}

  async putCommand(item: Record<string, any>): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: item,
    });
    await this.client.send(command);
  }

  async updateCommand(
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
      ConditionExpression: 'attribute_exists(id)',
    };

    const command = new UpdateCommand(params);
    const result = await this.client.send(command);
    return result.Attributes;
  }

  async scanCommand(params?: ScanCommandInput): Promise<T[]> {
    const command = new ScanCommand({ ...params, TableName: this.tableName });
    const response = await this.client.send(command);
    return response.Items ? response.Items.map((item) => item as T) : [];
  }

  async queryCommand(
    input: Omit<QueryCommandInput, 'TableName'>,
  ): Promise<T[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      ...input,
    });
    const response = await this.client.send(command);

    console.log(
      `Resultado do comando QueryCommand - ${JSON.stringify(response.Items)}`,
    );
    return response.Items ? response.Items.map((item) => item as T) : [];
  }

  async getCommand(key: Record<string, any>): Promise<T | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: key,
    });
    const { Item } = await this.client.send(command);
    return Item ? (Item as T) : null;
  }
}
