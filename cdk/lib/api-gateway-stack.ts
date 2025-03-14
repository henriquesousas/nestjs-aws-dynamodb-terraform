import { Stack, StackProps } from 'aws-cdk-lib';
import {
  ConnectionType,
  Integration,
  IntegrationType,
  RestApi,
  VpcLink,
} from 'aws-cdk-lib/aws-apigateway';
import { NetworkLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

interface ApiGatewayStackProps extends StackProps {
  nlb: NetworkLoadBalancer;
}

export class ApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    const vpcLink = new VpcLink(this, 'VpcLink', {
      targets: [props.nlb],
    });

    const restApi = new RestApi(this, 'RestApi', {
      restApiName: 'ECommerceRestApi',
    });

    this.createUserResource(restApi, props, vpcLink);
  }

  private createUserResource(
    restApi: RestApi,
    props: ApiGatewayStackProps,
    vpcLink: VpcLink,
  ) {
    // /user
    const userResource = restApi.root.addResource('user');
    userResource.addMethod(
      'GET',
      new Integration({
        type: IntegrationType.HTTP_PROXY,
        integrationHttpMethod: 'GET',
        uri: 'http://' + props.nlb.loadBalancerDnsName + ':8000/user',
        options: {
          vpcLink,
          connectionType: ConnectionType.VPC_LINK,
        },
      }),
    );
  }
}
