import { Stack, StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import {
  ApplicationLoadBalancer,
  NetworkLoadBalancer,
} from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

export interface LoadBalancerStackProps extends StackProps {
  readonly vpc: Vpc;
}

export class LoadBalancerStack extends Stack {
  readonly nlb: NetworkLoadBalancer;
  readonly alb: ApplicationLoadBalancer;

  constructor(scope: Construct, id: string, props: LoadBalancerStackProps) {
    super(scope, id, props);

    this.nlb = new NetworkLoadBalancer(this, 'Nlb', {
      loadBalancerName: 'EcommerceNlb',
      vpc: props.vpc,
      internetFacing: false,
    });

    this.alb = new ApplicationLoadBalancer(this, 'Alb', {
      loadBalancerName: 'EcommerceAlb',
      vpc: props.vpc,
      internetFacing: false,
    });
  }
}
