#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EcrStack } from '../lib/ecr-stack';
import { Environment } from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc-stack';
import { EcsClusterStack } from '../lib/ecs-cluster-stacjk';
import { LoadBalancerStack } from '../lib/load-balance-stack';

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

const vpcStack = new VpcStack(app, 'Vpc', { env, tags });

const clusterStack = new EcsClusterStack(app, 'Cluster', {
  vpc: vpcStack.vpc,
  env,
  tags,
});
clusterStack.addDependency(vpcStack);

const loadBalancerStack = new LoadBalancerStack(app, 'LoadBalancer', {
  vpc: vpcStack.vpc,
  env,
  tags,
});
loadBalancerStack.addDependency(vpcStack);
