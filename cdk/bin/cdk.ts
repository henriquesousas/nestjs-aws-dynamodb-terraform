#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EcrStack } from '../lib/ecr-stack';
import { VpcStack } from '../lib/vpc-stack';
import { LoadBalancerStack } from '../lib/load-balance-stack';
import { ClusterStack } from '../lib/cluster-stack';
import { UserServiceStack } from '../lib/user-service-stack';
import { ApiGatewayStack } from '../lib/api-gateway-stack';

const env: cdk.Environment = {
  account: '418272770772',
  region: 'us-east-1',
};

const tags = {
  cost: 'ECommerceInfra',
  team: 'Siecolade',
};

const app = new cdk.App();

const ecrStack = new EcrStack(app, 'Ecr', { env, tags });
const vpcStack = new VpcStack(app, 'Vpc', { env, tags });
const lbStack = new LoadBalancerStack(app, 'LoadBalancer', {
  vpc: vpcStack.vpc,
  env,
  tags,
});
lbStack.addDependency(vpcStack);

const clusterStack = new ClusterStack(app, 'Cluster', {
  vpc: vpcStack.vpc,
  env,
  tags,
});
clusterStack.addDependency(vpcStack);

const userServiceTags = {
  cost: 'UserService',
  team: 'SiecolaCode',
};

const userServiceStack = new UserServiceStack(app, 'UserService', {
  tags: userServiceTags,
  env: env,
  alb: lbStack.alb,
  nlb: lbStack.nlb,
  cluster: clusterStack.cluster,
  vpc: vpcStack.vpc,
  repository: ecrStack.userServiceRepository,
});
userServiceStack.addDependency(lbStack);
userServiceStack.addDependency(clusterStack);
userServiceStack.addDependency(vpcStack);
userServiceStack.addDependency(ecrStack);

const apiStack = new ApiGatewayStack(app, 'Api', {
  nlb: lbStack.nlb,
  env,
  tags,
});

apiStack.addDependency(lbStack);
apiStack.addDependency(userServiceStack);
