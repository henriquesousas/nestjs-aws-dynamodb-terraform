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
    const userResource = restApi.root.addResource('user');
    // GET ALL /user
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

    // POST /user
    userResource.addMethod(
      'POST',
      new Integration({
        type: IntegrationType.HTTP_PROXY,
        integrationHttpMethod: 'POST',
        uri: 'http://' + props.nlb.loadBalancerDnsName + ':8000/user',
        options: {
          vpcLink,
          connectionType: ConnectionType.VPC_LINK,
        },
      }),
    );

    const userIdResource = userResource.addResource('{userId}');
    //Para validar no ApiGateway da AWS que a requisicao deve ter esses parametros,
    //que podem vir via (body,path,url, etc...)
    const userIdIntegrationParameters = {
      'integration.request.path.userId': 'method.request.path.userId',
    };

    const userIdMethodParameters = {
      'method.request.path.userId': true,
    };

    // GET /:userId
    userIdResource.addMethod(
      'GET',
      new Integration({
        type: IntegrationType.HTTP_PROXY,
        integrationHttpMethod: 'GET',
        uri: 'http://' + props.nlb.loadBalancerDnsName + ':8000/user/{userId}',
        options: {
          vpcLink,
          connectionType: ConnectionType.VPC_LINK,
          requestParameters: userIdIntegrationParameters,
        },
      }),
      {
        requestParameters: userIdMethodParameters,
      },
    );
    // PUT /:userId
    userIdResource.addMethod(
      'PUT',
      new Integration({
        type: IntegrationType.HTTP_PROXY,
        integrationHttpMethod: 'PUT',
        uri: 'http://' + props.nlb.loadBalancerDnsName + ':8000/user/{userId}',
        options: {
          vpcLink,
          connectionType: ConnectionType.VPC_LINK,
          requestParameters: userIdIntegrationParameters,
        },
      }),
      {
        requestParameters: userIdMethodParameters,
      },
    );
    // DELETE /:userId
    userIdResource.addMethod(
      'DELETE',
      new Integration({
        type: IntegrationType.HTTP_PROXY,
        integrationHttpMethod: 'DELETE',
        uri: 'http://' + props.nlb.loadBalancerDnsName + ':8000/user/{userId}',
        options: {
          vpcLink,
          connectionType: ConnectionType.VPC_LINK,
          requestParameters: userIdIntegrationParameters,
        },
      }),
      {
        requestParameters: userIdMethodParameters,
      },
    );
  }
}
