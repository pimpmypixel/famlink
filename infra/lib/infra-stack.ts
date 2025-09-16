import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';

export class LaravelUploadStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the S3 bucket
    const uploadBucket = new s3.Bucket(this, 'FamlinkUploadBucket', {
      bucketName: `${this.account}-famlink-uploads`,
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

    // Output bucket name for Laravel .env config
    new cdk.CfnOutput(this, 'UploadBucketName', {
      value: uploadBucket.bucketName,
    });
  }
}
