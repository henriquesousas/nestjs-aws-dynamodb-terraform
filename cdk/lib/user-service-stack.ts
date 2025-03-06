import { Stack, StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Cluster, FargateTaskDefinition } from 'aws-cdk-lib/aws-ecs';
import {
  ApplicationLoadBalancer,
  NetworkLoadBalancer,
} from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

export interface UserServiceStackProps extends StackProps {
  readonly vpc: Vpc;
  readonly cluster: Cluster;
  readonly nlb: NetworkLoadBalancer;
  readonly alb: ApplicationLoadBalancer;
  readonly repository: Repository;
}

export class UserServiceStack extends Stack {
  constructor(scope: Construct, id: string, props: UserServiceStackProps) {
    super(scope, id, props);

    const taskDefinition = new FargateTaskDefinition(this, 'TaskDefinition', {
      cpu: 512,
      memoryLimitMiB: 1024,
      family: 'user-service',
    });
  }
}
