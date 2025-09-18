import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class FamlinkStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {

    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'FamLinkVpc', { maxAzs: 2 });

    // ECS Cluster
    const cluster = new ecs.Cluster(this, 'FamLinkCluster', { vpc });

    // DB Credentials
    const dbSecret = new rds.DatabaseSecret(this, 'DBSecret', {
      username: 'postgres',
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

    const bucketName = `${this.account}-famlink-uploads`;
    let bucket: s3.IBucket;


    try {
      // Try to import existing bucket
      bucket = s3.Bucket.fromBucketName(this, 'FamLinkUploadBucket', bucketName);
      new cdk.CfnOutput(this, 'UploadsBucketImported', {
        value: bucket.bucketName,
      });
    } catch (e) {
      // Create the S3 bucket
      bucket = new s3.Bucket(this, 'FamLinkUploadBucket', {
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
  }

    // IAM policy for Laravel app (EC2, ECS task, or Lambda role)
    const bucketPolicy = new iam.PolicyStatement({
      actions: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject'],
      resources: [`${bucket.bucketArn}/*`],
    });

    /* const famlinkS3Role = new iam.Role(this, 'FamLinkAppRole', {
    });
  }

    // IAM policy for Laravel app (EC2, ECS task, or Lambda role)
    const bucketPolicy = new iam.PolicyStatement({
      actions: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject'],
      resources: [`${uploadBucket.bucketArn}/*`],
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
        image: ecs.ContainerImage.fromRegistry('035338517878.dkr.ecr.eu-central-1.amazonaws.com/famlink:latest'), // Laravel Dockerfile in root
        containerPort: 80,
        environment: {
          APP_ENV: 'production',
          APP_KEY: 'base64:YOUR_APP_KEY', // Ideally from Secrets Manager
          DB_CONNECTION: 'pgsql',
          DB_HOST: db.dbInstanceEndpointAddress,
          DB_PORT: '5432',
          DB_DATABASE: 'famlink',
          DB_USERNAME: 'famlinkuser',
          FILESYSTEM_DRIVER: 's3',
          AWS_BUCKET: bucket.bucketName,
        },
        secrets: {
          DB_PASSWORD: ecs.Secret.fromSecretsManager(dbSecret, 'password'),
        }
      }
    });

    // Permissions
    bucket.grantReadWrite(fargateService.taskDefinition.taskRole);
    db.connections.allowDefaultPortFrom(fargateService.service);

    new cdk.CfnOutput(this, 'LoadBalancerURL', {
      value: fargateService.loadBalancer.loadBalancerDnsName,
    });
    // Output bucket name for Laravel .env config
    new cdk.CfnOutput(this, 'UploadBucketName', {
      value: bucket.bucketName,
    });
  }
}
