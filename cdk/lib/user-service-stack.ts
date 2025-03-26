import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

export interface UserServiceStackProps extends cdk.StackProps {
  readonly vpc: ec2.Vpc;
  readonly cluster: ecs.Cluster;
  readonly nlb: elbv2.NetworkLoadBalancer;
  readonly alb: elbv2.ApplicationLoadBalancer;
  readonly repository: ecr.Repository;
}

export class UserServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: UserServiceStackProps) {
    super(scope, id, props);

    // In your ECS Stack
    const taskRole = new Role(this, 'ECSTaskRole', {
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

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

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      'TaskDefinition',
      {
        cpu: 512,
        memoryLimitMiB: 1024,
        family: 'user-service',
        taskRole: taskRole,
      },
    );

    userDynamoDb.addGlobalSecondaryIndex({
      indexName: 'EmailIndex', // Name of the index
      partitionKey: {
        name: 'email', // The attribute to be indexed
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL, // Projection type (ALL means it will project all attributes)
      readCapacity: 1, // Read capacity for the index
      writeCapacity: 1, // Write capacity for the index
    });

    //Atribui a nossa tarefa a permissao de ler e escrever dados na tabela dynamo
    userDynamoDb.grantReadWriteData(taskDefinition.taskRole);
    userDynamoDb.grantReadWriteData(taskRole);

    const logDriver = ecs.LogDriver.awsLogs({
      logGroup: new logs.LogGroup(this, 'LogGroup', {
        logGroupName: 'UserService',
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        retention: logs.RetentionDays.ONE_WEEK,
      }),
      streamPrefix: 'UserService',
    });

    //Definindo o container na AWS
    taskDefinition.addContainer('UserServiceContainer', {
      image: ecs.ContainerImage.fromEcrRepository(props.repository, '6.0.37'),
      containerName: 'UserService',
      logging: logDriver,
      portMappings: [
        {
          containerPort: 8000,
          protocol: ecs.Protocol.TCP,
        },
      ],
      environment: {
        USERS_DYNAMO_DB: userDynamoDb.tableName,
      },
    });

    const albListener = props.alb.addListener('UserServiceAlbListener', {
      port: 8000,
      protocol: elbv2.ApplicationProtocol.HTTP,
      open: true,
    });

    const service = new ecs.FargateService(this, 'UserService', {
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
      ec2.Peer.ipv4(props.vpc.vpcCidrBlock),
      ec2.Port.tcp(8000),
    );

    albListener.addTargets('UserServiceAlbTarget', {
      targetGroupName: 'UserServiceTargetGroup',
      port: 8000,
      targets: [service],
      protocol: elbv2.ApplicationProtocol.HTTP,
      deregistrationDelay: cdk.Duration.seconds(30),
      healthCheck: {
        // a cada requisicao
        interval: cdk.Duration.seconds(30),
        enabled: true,
        port: '8000',
        // se demorar 10 segundos, entao entra no modo de desregistrar a applicacao
        timeout: cdk.Duration.seconds(10),
        path: '/health',
      },
    });

    const nlbListener = props.nlb.addListener('UserServiceNlbListener', {
      port: 8000,
      protocol: elbv2.Protocol.TCP,
    });

    nlbListener.addTargets('UserServiceNlbTarget', {
      port: 8000,
      targetGroupName: 'UserServiceNlb',
      protocol: elbv2.Protocol.TCP,
      targets: [
        service.loadBalancerTarget({
          containerName: 'UserService',
          containerPort: 8000,
          protocol: ecs.Protocol.TCP,
        }),
      ],
    });
  }
}
