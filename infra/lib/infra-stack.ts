import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { VpcConstruct } from './vpc';
import { SecurityGroupsConstruct } from './security-groups';
import { RdsConstruct } from './rds';
import { S3Construct } from './s3';
import { IamConstruct } from './iam';
import { Ec2Construct } from './ec2';
import { EbsConstruct } from './ebs';
import { LoadBalancerConstruct } from './load-balancer';
import { SecretsManagerConstruct } from './secrets-manager';
import { Route53Construct } from './route53';
import { AcmConstruct } from './acm';

export class FamlinkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Determine environment from context or default to dev
    const isProduction = this.node.tryGetContext('isProduction') === 'true' || false;
    const environment = isProduction ? 'prod' : 'dev';

    // VPC - Networking infrastructure
    const vpcConstruct = new VpcConstruct(this, 'Vpc', {
      maxAzs: isProduction ? 3 : 2,
      natGateways: isProduction ? 1 : 0, // Cost optimization for dev
    });

    // Security Groups - Traffic control
    const securityGroupsConstruct = new SecurityGroupsConstruct(this, 'SecurityGroups', {
      vpc: vpcConstruct.vpc,
      isProduction,
    });

    // Secrets Manager - Secure credential storage
    const secretsConstruct = new SecretsManagerConstruct(this, 'Secrets', {
      appName: 'famlink',
      environment,
    });

    // RDS - PostgreSQL database
    const rdsConstruct = new RdsConstruct(this, 'Database', {
      vpc: vpcConstruct.vpc,
      securityGroup: securityGroupsConstruct.rdsSecurityGroup,
      databaseName: 'famlink',
      instanceType: isProduction
        ? ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL)
        : ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      allocatedStorage: isProduction ? 100 : 20,
      multiAz: isProduction,
      backupRetention: cdk.Duration.days(isProduction ? 30 : 7),
      removalPolicy: isProduction ? cdk.RemovalPolicy.SNAPSHOT : cdk.RemovalPolicy.DESTROY,
      deletionProtection: isProduction,
      isProduction,
    });

    const s3BucketName = `${this.account}-famlink-uploads`;
    const bucket = cdk.aws_s3.Bucket.fromBucketName(this, 'ImportedBucket', s3BucketName);

    // S3 - File storage
    const s3Construct = new S3Construct(this, 'S3', {
      bucketName: bucket.bucketName,
      isProduction,
      retentionDays: isProduction ? 365 : 90,
    });

    // IAM - Roles and policies
    const iamConstruct = new IamConstruct(this, 'Iam', {
      s3Bucket: s3Construct.bucket,
      dbSecret: rdsConstruct.secret,
      isProduction,
    });

    // EC2 - Application server (commented out for now - uncomment when ready)
    /*
    const ec2Construct = new Ec2Construct(this, 'Ec2', {
      vpc: vpcConstruct.vpc,
      securityGroup: securityGroupsConstruct.ec2SecurityGroup,
      instanceProfile: iamConstruct.ec2InstanceProfile,
      instanceType: isProduction
        ? ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL)
        : ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      isProduction,
    });

    // EBS - Additional block storage
    const ebsConstruct = new EbsConstruct(this, 'Ebs', {
      instance: ec2Construct.instance,
      size: isProduction ? 50 : 20,
      volumeType: ec2.EbsDeviceVolumeType.GP3,
      encrypted: true,
    });

    // Load Balancer - Traffic distribution
    const loadBalancerConstruct = new LoadBalancerConstruct(this, 'LoadBalancer', {
      vpc: vpcConstruct.vpc,
      securityGroup: securityGroupsConstruct.albSecurityGroup,
      instances: [ec2Construct.instance],
      isProduction,
    });

    // Route 53 - DNS (uncomment and configure domain when ready)
    // const domainName = isProduction ? 'famlink.example.com' : 'dev.famlink.example.com';
    // const route53Construct = new Route53Construct(this, 'Route53', {
    //   domainName,
    //   loadBalancer: loadBalancerConstruct.loadBalancer,
    //   createHostedZone: false, // Set to true if creating new hosted zone
    //   hostedZoneId: 'Z123456789', // Replace with actual hosted zone ID
    // });

    // ACM - SSL certificates (uncomment when Route 53 is configured)
    // const acmConstruct = new AcmConstruct(this, 'Acm', {
    //   domainName,
    //   hostedZone: route53Construct.hostedZone,
    //   subjectAlternativeNames: isProduction ? ['www.famlink.example.com'] : [],
    // });
    */

    // Outputs
    new cdk.CfnOutput(this, 'VpcId', {
      value: vpcConstruct.vpc.vpcId,
      description: 'VPC ID',
    });

    new cdk.CfnOutput(this, 'UploadBucketName', {
      value: s3Construct.bucketName,
      description: 'S3 bucket for file uploads',
    });

    new cdk.CfnOutput(this, 'DatabaseHost', {
      value: rdsConstruct.endpoint,
      description: 'PostgreSQL database host',
    });

    new cdk.CfnOutput(this, 'DatabasePort', {
      value: rdsConstruct.port,
      description: 'PostgreSQL database port',
    });

    new cdk.CfnOutput(this, 'DatabaseName', {
      value: 'famlink',
      description: 'PostgreSQL database name',
    });

    new cdk.CfnOutput(this, 'DatabaseSecretArn', {
      value: rdsConstruct.secret.secretArn,
      description: 'Database secret ARN',
    });

    new cdk.CfnOutput(this, 'AppSecretsArn', {
      value: secretsConstruct.appSecrets.secretArn,
      description: 'Application secrets ARN',
    });

    // Uncomment when EC2 is enabled
    /*
    new cdk.CfnOutput(this, 'Ec2InstanceId', {
      value: ec2Construct.instanceId,
      description: 'EC2 instance ID',
    });

    new cdk.CfnOutput(this, 'LoadBalancerDnsName', {
      value: loadBalancerConstruct.loadBalancer.loadBalancerDnsName,
      description: 'Load balancer DNS name',
    });
    */
  }
}
