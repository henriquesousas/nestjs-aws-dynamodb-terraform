import { Stack, StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerInsights } from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';

export interface EcsClusterStackProps extends StackProps {
  readonly vpc: Vpc;
}

export class EcsClusterStack extends Stack {
  readonly cluster: Cluster;
  constructor(scope: Construct, id: string, props: EcsClusterStackProps) {
    super(scope, id, props);

    this.cluster = new Cluster(this, 'EcommerceCluster', {
      clusterName: 'Ecommerce',
      vpc: props.vpc,
      containerInsightsV2: ContainerInsights.ENABLED,
    });
  }
}
