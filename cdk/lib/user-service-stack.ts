import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Peer, Port, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import {
  Cluster,
  ContainerImage,
  FargateService,
  FargateTaskDefinition,
  LogDriver,
  Protocol as ECSProtocol,
} from 'aws-cdk-lib/aws-ecs';
import {
  ApplicationLoadBalancer,
  ApplicationProtocol,
  NetworkLoadBalancer,
  Protocol,
} from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cdk from 'aws-cdk-lib';

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

    const userDynamoDb = new dynamodb.Table(this, 'UserDynamoDb', {
      tableName: 'users',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    });

    const taskDefinition = new FargateTaskDefinition(this, 'TaskDefinition', {
      cpu: 512,
      memoryLimitMiB: 1024,
      family: 'user-service',
    });

    const logDriver = LogDriver.awsLogs({
      logGroup: new LogGroup(this, 'LogGroup', {
        logGroupName: 'UserService',
        removalPolicy: RemovalPolicy.DESTROY,
        retention: RetentionDays.ONE_WEEK,
      }),
      streamPrefix: 'UserService',
    });

    taskDefinition.addContainer('UserServiceContainer', {
      image: ContainerImage.fromEcrRepository(props.repository, '2.0.0'),
      containerName: 'UserService',
      logging: logDriver,
      portMappings: [
        {
          containerPort: 8000,
          protocol: ECSProtocol.TCP,
        },
      ],
    });

    const albListener = props.alb.addListener('UserServiceAlbListener', {
      port: 8000,
      protocol: ApplicationProtocol.HTTP,
      open: true,
    });

    const nlbListener = props.nlb.addListener('UserServiceNlbListener', {
      port: 8000,
      protocol: Protocol.TCP,
    });

    const service = new FargateService(this, 'UserService', {
      serviceName: 'UserService',
      cluster: props.cluster,
      taskDefinition: taskDefinition,
      desiredCount: 2,
      //Usar esta opcao de ip publico apenas se colocou na criação
      // da VPC o => natGateways: 0,
      // assignPublicIp: true,
    });
    // Dando permissão pra acessar o container de repository com a imagem docker
    props.repository.grantPull(taskDefinition.taskRole);

    service.connections.securityGroups[0].addIngressRule(
      Peer.ipv4(props.vpc.vpcCidrBlock),
      Port.tcp(8000),
    );

    albListener.addTargets('UserServiceAlbTarget', {
      targetGroupName: 'UserServiceTargetGroup',
      port: 8000,
      targets: [service],
      protocol: ApplicationProtocol.HTTP,
      deregistrationDelay: Duration.seconds(30),
      healthCheck: {
        // a cada requisicao
        interval: Duration.seconds(30),
        enabled: true,
        port: '8000',
        // se demorar 10 segundos, entao entra no modo de desregistrar a applicacao
        timeout: Duration.seconds(10),
        path: '/health',
      },
    });

    nlbListener.addTargets('UserServiceNlbTarget', {
      port: 8000,
      targetGroupName: 'UserServiceNlb',
      protocol: Protocol.TCP,
      targets: [
        service.loadBalancerTarget({
          containerName: 'UserService',
          containerPort: 8000,
          protocol: ECSProtocol.TCP,
        }),
      ],
    });
  }
}
