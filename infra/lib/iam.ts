import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export interface IamConstructProps {
  readonly s3Bucket: s3.IBucket;
  readonly dbSecret?: secretsmanager.ISecret;
  /**
   * Whether this is a production environment (affects policy restrictions)
   * @default false
   */
  readonly isProduction?: boolean;
}

export class IamConstruct extends Construct {
  public readonly ec2Role: iam.Role;
  public readonly ec2InstanceProfile: iam.CfnInstanceProfile;

  constructor(scope: Construct, id: string, props: IamConstructProps) {
    super(scope, id);

    const { s3Bucket, dbSecret, isProduction = false } = props;

    // IAM Role for EC2 instances
    this.ec2Role = new iam.Role(this, 'Ec2Role', {
      roleName: `FamLinkEc2Role-${isProduction ? 'prod' : 'dev'}`,
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      description: 'IAM role for FamLink EC2 instances',
    });

    // S3 access policy
    const s3Policy = new iam.PolicyStatement({
      actions: [
        's3:GetObject',
        's3:PutObject',
        's3:DeleteObject',
        's3:ListBucket',
        's3:GetBucketLocation',
      ],
      resources: [
        s3Bucket.bucketArn,
        `${s3Bucket.bucketArn}/*`,
      ],
    });

    // CloudWatch Logs policy for application logging
    const cloudWatchPolicy = new iam.PolicyStatement({
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
        'logs:DescribeLogStreams',
      ],
      resources: ['*'], // Scoped to account-level CloudWatch resources
    });

    // SSM policy for parameter access and session management
    const ssmPolicy = new iam.PolicyStatement({
      actions: [
        'ssm:GetParameter',
        'ssm:GetParameters',
        'ssm:GetParametersByPath',
        'ssm:DescribeParameters',
        'ssm:StartSession', // For SSM Session Manager
      ],
      resources: ['*'],
    });

    // Database secret access policy (if secret is provided)
    let dbSecretPolicy: iam.PolicyStatement | undefined;
    if (dbSecret) {
      dbSecretPolicy = new iam.PolicyStatement({
        actions: [
          'secretsmanager:GetSecretValue',
          'secretsmanager:DescribeSecret',
        ],
        resources: [dbSecret.secretArn],
      });
    }

    // Attach policies to the role
    this.ec2Role.addToPolicy(s3Policy);
    this.ec2Role.addToPolicy(cloudWatchPolicy);
    this.ec2Role.addToPolicy(ssmPolicy);

    if (dbSecretPolicy) {
      this.ec2Role.addToPolicy(dbSecretPolicy);
    }

    // Attach managed policies
    this.ec2Role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')
    );

    // Create instance profile for EC2
    this.ec2InstanceProfile = new iam.CfnInstanceProfile(this, 'Ec2InstanceProfile', {
      instanceProfileName: `FamLinkEc2Profile-${isProduction ? 'prod' : 'dev'}`,
      roles: [this.ec2Role.roleName],
    });
  }
}
