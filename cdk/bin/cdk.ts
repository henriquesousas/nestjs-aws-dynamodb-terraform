#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EcrStack } from '../lib/ecr-stack';
import { Environment } from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc-stack';

const env: Environment = {
  account: '418272770772',
  region: 'us-east-1',
};

const tags = {
  cost: 'ECommerceInfra',
  team: 'Siecolade',
};

const app = new cdk.App();
new EcrStack(app, 'Ecr', { env, tags });
new VpcStack(app, 'Vpc', { env, tags });
