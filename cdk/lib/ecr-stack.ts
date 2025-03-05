import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Repository, TagMutability } from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

/**
 * ECR => AWS Elastic Container Repository
 * Recurso para armazenar gerenciar imagem docker dentro da AWS
 */
export class EcrStack extends Stack {
  readonly userServiceRepository: Repository;
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    //ECR
    this.userServiceRepository = new Repository(this, 'UserService', {
      repositoryName: 'user-service', //aqui usei o nome da imagem do docker que foi criado
      imageTagMutability: TagMutability.IMMUTABLE, //significa que não consigo subir uma imagem com a mesma tag
      emptyOnDelete: true, //signifca que se apagar o repository também será apagado todas as images
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}
