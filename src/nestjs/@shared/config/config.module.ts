/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import {
  ConfigModuleOptions,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import Joi from 'joi';
import { join } from 'path';

type DYNAMODB_SCHEMA_TYPE = {
  AWS_REGION: string;
  AWS_URL: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  DYNAMO_TABLE_USERS: string;
};

export const CONFIG_DINAMODB_SCHEMA: Joi.StrictSchemaMap<DYNAMODB_SCHEMA_TYPE> =
  {
    AWS_REGION: Joi.string().required(),
    AWS_URL: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    DYNAMO_TABLE_USERS: Joi.string().required(),
  };

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options: ConfigModuleOptions = {}) {
    const { envFilePath, ...otherOptions } = options;

    return super.forRoot({
      isGlobal: true,
      envFilePath: [
        ...(Array.isArray(envFilePath) ? envFilePath : [envFilePath!]),
        join(process.cwd(), 'envs', `.env.${process.env.NODE_ENV!}`),
        join(process.cwd(), 'envs', `.env`),
      ],
      validationSchema: Joi.object({
        ...CONFIG_DINAMODB_SCHEMA,
      }),
      ...otherOptions,
    });
  }
}
