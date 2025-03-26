import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

export class EcrStack extends cdk.Stack {
  readonly userServiceRepository: ecr.Repository;
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    this.userServiceRepository = new ecr.Repository(this, 'UserService', {
      repositoryName: 'user-service', //aqui usei o nome da imagem do docker que foi criado
      imageTagMutability: ecr.TagMutability.IMMUTABLE, //significa que não consigo subir uma imagem com a mesma tag
      emptyOnDelete: true, //signifca que se apagar o repository também será apagado todas as images
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
