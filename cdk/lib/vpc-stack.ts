import { Stack, StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

/**
 * VPC => AWS Virtual Private Cloud
 * Componente da VPC que permiti que recursos em uma sub-rede privada
 * se comunique com a internet
 */
export class VpcStack extends Stack {
  readonly vpc: Vpc;
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    //ECR
    this.vpc = new Vpc(this, 'EcommerceVPC', {
      vpcName: 'EcommerceVPC',
      maxAzs: 2,
      //DO NOT IN PRODUCTION
      // natGateways: 0,
    });
  }
}
