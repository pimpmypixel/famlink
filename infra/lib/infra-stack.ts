import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { TaskDefinition } from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

import * as ecr from 'aws-cdk-lib/aws-ecr';

export class FamlinkStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {

    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'FamLinkVpc', { maxAzs: 2 });

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'FamLinkCluster', { vpc });

    const repository = ecr.Repository.fromRepositoryName(this, 'FamLinkRepository', 'famlink');

    // ECR Repository
    // const repository = new ecr.Repository(this, 'FamLinkRepository', {
    //   repositoryName: 'famlink',
    //   removalPolicy: cdk.RemovalPolicy.DESTROY,
    // });

    // // DB Credentials
    // const dbSecret = new rds.DatabaseSecret(this, 'DBSecret', {
    //   username: 'famlinkuser',
    // });

    // Create a secret for DB credentials
    const dbSecret = new Secret(this, 'DBCredentials', {
      secretName: 'famlink-db-credentials',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          username: 'famlinkuser',
          host: 'famlink-db-host',
          port: '3306',
        }),
        generateStringKey: 'password',
        excludePunctuation: true,
        includeSpace: false,
      },
    });

    // App Key Secret
    const appKeySecret = new secretsmanager.Secret(this, 'AppKeySecret', {
      secretName: 'famlink/app-key',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({}),
        generateStringKey: 'APP_KEY',
        excludePunctuation: true,
        includeSpace: false,
      },
    });

    // RDS (PostgreSQL)
    const db = new rds.DatabaseInstance(this, 'FamLinkDB', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15
      }),
      vpc,
      credentials: rds.Credentials.fromSecret(dbSecret),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      allocatedStorage: 20,
      multiAz: false,
      publiclyAccessible: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const bucketName = `famlink-uploads-${this.stackName.toLowerCase()}`;

    // Create the S3 bucket
    const bucket = new s3.Bucket(this, 'FamLinkUploadBucket', {
      bucketName,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // dev only
      autoDeleteObjects: true, // dev only
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST, s3.HttpMethods.DELETE],
          allowedOrigins: ['*'], // restrict later in production
          allowedHeaders: ['*'],
        },
      ],
    });

    /* const famlinkS3Role = new iam.Role(this, 'FamLinkAppRole', {
      roleName: 'FamLinkAppRole',
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'), // or ecs-tasks.amazonaws.com, or lambda.amazonaws.com
    });

    famlinkS3Role.addToPolicy(new iam.PolicyStatement({
      actions: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject'],
      resources: [`${uploadBucket.bucketArn}/*`],
    })); */

    // Fargate Service with Load Balancer
    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'FamlinkService', {
      cluster,
      cpu: 512,
      desiredCount: 1,
      memoryLimitMiB: 1024,
      publicLoadBalancer: true,
      taskImageOptions: {
        containerName: 'web',
        image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
        containerPort: 80,
        environment: {
          APP_ENV: 'production',
          DB_CONNECTION: 'pgsql',
          FILESYSTEM_DRIVER: 's3',
          AWS_BUCKET: bucket.bucketName,
        },
        secrets: {
          DB_HOST: ecs.Secret.fromSecretsManager(dbSecret, 'host'),
          DB_PORT: ecs.Secret.fromSecretsManager(dbSecret, 'port'),
          DB_USERNAME: ecs.Secret.fromSecretsManager(dbSecret, 'username'),
          DB_PASSWORD: ecs.Secret.fromSecretsManager(dbSecret, 'password'),
          APP_KEY: ecs.Secret.fromSecretsManager(appKeySecret, 'APP_KEY'),
        }
      }
    });

    // Permissions
    bucket.grantReadWrite(fargateService.taskDefinition.taskRole);
    db.connections.allowDefaultPortFrom(fargateService.service);

    // Grant ECS task permission to read all relevant secrets
    fargateService.taskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
      actions: ['secretsmanager:GetSecretValue'],
      resources: [dbSecret.secretArn, appKeySecret.secretArn],
    }));


    // Outputs

    new cdk.CfnOutput(this, 'LoadBalancerURL', {
      value: fargateService.loadBalancer.loadBalancerDnsName,
    });
    new cdk.CfnOutput(this, 'UploadBucketName', {
      value: bucket.bucketName,
    });
    new cdk.CfnOutput(this, 'ECRRepositoryURI', {
      value: repository.repositoryUri,
    });
    new cdk.CfnOutput(this, 'DBSecretArn', {
      value: dbSecret.secretArn,
    });
    new cdk.CfnOutput(this, 'AppKeySecretArn', {
      value: appKeySecret.secretArn,
    });
  }
}
