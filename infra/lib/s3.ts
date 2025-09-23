import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

export interface S3ConstructProps {
  /**
   * Custom bucket name (will be prefixed with stack name if not provided)
   */
  readonly bucketName?: string;

  /**
   * Whether this is a production environment (affects lifecycle and deletion policies)
   * @default false
   */
  readonly isProduction?: boolean;

  /**
   * Number of days to retain objects before deletion (for development cleanup)
   * @default 90
   */
  readonly retentionDays?: number;
}

export class S3Construct extends Construct {
  public readonly bucket: s3.Bucket;
  public readonly bucketName: string;

  constructor(scope: Construct, id: string, props: S3ConstructProps = {}) {
    super(scope, id);

    const {
      bucketName,
      isProduction = false,
      retentionDays = 90,
    } = props;

    // Generate bucket name if not provided
    const generatedBucketName = bucketName ||
      `famlink-uploads-${cdk.Stack.of(this).stackName.toLowerCase()}`;

    this.bucketName = generatedBucketName;

    // Create S3 bucket for file uploads
    this.bucket = new s3.Bucket(this, 'UploadBucket', {
      bucketName: this.bucketName,
      removalPolicy: isProduction
        ? cdk.RemovalPolicy.RETAIN
        : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: !isProduction, // Only auto-delete in development
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
          ],
          allowedOrigins: isProduction
            ? ['https://yourdomain.com'] // Replace with actual domain
            : ['*'], // Allow all in development
          allowedHeaders: ['*'],
          maxAge: 300, // 5 minutes
        },
      ],
      lifecycleRules: [
        {
          id: 'delete-old-uploads',
          enabled: !isProduction, // Only enable cleanup in development
          expiration: cdk.Duration.days(retentionDays),
          abortIncompleteMultipartUploadAfter: cdk.Duration.days(1),
        },
        // Add versioning and transition to cheaper storage for production
        ...(isProduction ? [{
          id: 'transition-to-ia',
          enabled: true,
          transitions: [
            {
              storageClass: s3.StorageClass.INFREQUENT_ACCESS,
              transitionAfter: cdk.Duration.days(30),
            },
            {
              storageClass: s3.StorageClass.GLACIER,
              transitionAfter: cdk.Duration.days(90),
            },
          ],
        }] : []),
      ],
      // Enable versioning in production for backup/recovery
      versioned: isProduction,
      // Server access logging for production
      ...(isProduction && {
        serverAccessLogsBucket: new s3.Bucket(this, 'AccessLogsBucket', {
          bucketName: `${this.bucketName}-access-logs`,
          removalPolicy: cdk.RemovalPolicy.RETAIN,
          autoDeleteObjects: false,
          blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
          encryption: s3.BucketEncryption.S3_MANAGED,
        }),
        serverAccessLogsPrefix: 'access-logs/',
      }),
    });
  }
}
