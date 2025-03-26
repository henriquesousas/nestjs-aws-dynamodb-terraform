import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

/**
 * VPC => AWS Virtual Private Cloud
 * Componente da VPC que permiti que recursos em uma sub-rede privada
 * se comunique com a internet
 */
export class VpcStack extends cdk.Stack {
  readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'EcommerceVPC', {
      vpcName: 'EcommerceVPC',
      maxAzs: 2,
      //DO NOT IN PRODUCTION
      // natGateways: 0,
    });
    // this.vpc.addGatewayEndpoint('DynamoDbEndpoint', {
    //   service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
    // });
  }
}
