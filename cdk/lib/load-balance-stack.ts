import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

export interface LoadBalancerStackProps extends cdk.StackProps {
  readonly vpc: ec2.Vpc;
}

export class LoadBalancerStack extends cdk.Stack {
  readonly nlb: elbv2.NetworkLoadBalancer;
  readonly alb: elbv2.ApplicationLoadBalancer;

  constructor(scope: Construct, id: string, props: LoadBalancerStackProps) {
    super(scope, id, props);

    this.nlb = new elbv2.NetworkLoadBalancer(this, 'Nlb', {
      loadBalancerName: 'EcommerceNlb',
      vpc: props.vpc,
      internetFacing: false,
    });

    this.alb = new elbv2.ApplicationLoadBalancer(this, 'Alb', {
      loadBalancerName: 'EcommerceAlb',
      vpc: props.vpc,
      internetFacing: false,
    });
  }
}
