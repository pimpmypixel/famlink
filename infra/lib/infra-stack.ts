import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

export class FamlinkStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {

    super(scope, id, props);

    // VPC for RDS
    const vpc = new ec2.Vpc(this, 'FamLinkVpc', {
      maxAzs: 2,
      natGateways: 0, // Cost optimization for public RDS
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        }
      ]
    });

    // Security Group for RDS
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'FamLinkDBSecurityGroup', {
      vpc,
      description: 'Security group for FamLink PostgreSQL database',
      allowAllOutbound: true,
    });

    // Allow PostgreSQL access from anywhere (for development - restrict in production)
    dbSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(5432),
      'PostgreSQL access from anywhere'
    );

    // RDS PostgreSQL Database
    const db = new rds.DatabaseInstance(this, 'FamLinkDB', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16
      }),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      securityGroups: [dbSecurityGroup],
      credentials: rds.Credentials.fromPassword('famlink', cdk.SecretValue.unsafePlainText('DVSHefi2017')),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      allocatedStorage: 20,
      multiAz: false,
      publiclyAccessible: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deletionProtection: false,
      backupRetention: cdk.Duration.days(7),
    });

    // S3 Bucket for file uploads
    const bucketName = `${cdk.Aws.ACCOUNT_ID}-famlink-uploads}`;

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
      lifecycleRules: [
        {
          id: 'delete-old-uploads',
          enabled: true,
          expiration: cdk.Duration.days(90), // Auto-delete files after 90 days
        }
      ]
    });

    // IAM Role for application access to S3
    const famlinkS3Role = new iam.Role(this, 'FamLinkAppRole', {
      roleName: 'FamLinkAppRole',
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    famlinkS3Role.addToPolicy(new iam.PolicyStatement({
      actions: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject', 's3:ListBucket'],
      resources: [bucket.bucketArn, `${bucket.bucketArn}/*`],
    }));

    // Outputs
    new cdk.CfnOutput(this, 'UploadBucketName', {
      value: bucket.bucketName,
      description: 'S3 bucket for file uploads',
    });

    new cdk.CfnOutput(this, 'DatabaseHost', {
      value: db.dbInstanceEndpointAddress,
      description: 'PostgreSQL database host',
    });

    new cdk.CfnOutput(this, 'DatabasePort', {
      value: db.dbInstanceEndpointPort,
      description: 'PostgreSQL database port',
    });

    new cdk.CfnOutput(this, 'DatabaseName', {
      value: 'famlink',
      description: 'PostgreSQL database name',
    });

    new cdk.CfnOutput(this, 'DatabaseUsername', {
      value: 'famlink',
      description: 'PostgreSQL database username',
    });
  }
}
