import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export interface RdsConstructProps {
  readonly vpc: ec2.IVpc;
  readonly securityGroup: ec2.ISecurityGroup;
  readonly databaseName?: string;
  readonly instanceType?: ec2.InstanceType;
  readonly allocatedStorage?: number;
  readonly multiAz?: boolean;
  readonly backupRetention?: cdk.Duration;
  readonly removalPolicy?: cdk.RemovalPolicy;
  readonly deletionProtection?: boolean;
  /**
   * Whether this is a production environment
   * @default false
   */
  readonly isProduction?: boolean;
}

export class RdsConstruct extends Construct {
  public readonly database: rds.DatabaseInstance;
  public readonly secret: secretsmanager.Secret;
  public readonly endpoint: string;
  public readonly port: string;

  constructor(scope: Construct, id: string, props: RdsConstructProps) {
    super(scope, id);

    const {
      vpc,
      securityGroup,
      databaseName = 'famlink',
      instanceType = ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      allocatedStorage = 20,
      multiAz = false,
      backupRetention = cdk.Duration.days(7),
      removalPolicy = cdk.RemovalPolicy.DESTROY,
      deletionProtection = false,
      isProduction = false,
    } = props;

    // Create database secret for secure credential management
    this.secret = new secretsmanager.Secret(this, 'DatabaseSecret', {
      secretName: `famlink-db-secret-${isProduction ? 'prod' : 'dev'}`,
      description: 'Database credentials for FamLink application',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          username: 'famlink',
        }),
        generateStringKey: 'password',
        excludeCharacters: '/@" ',
      },
    });

    // Determine subnet type based on environment
    const subnetType = isProduction
      ? ec2.SubnetType.PRIVATE_ISOLATED
      : ec2.SubnetType.PUBLIC;

    // RDS PostgreSQL Database Instance
    this.database = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16
      }),
      vpc,
      vpcSubnets: {
        subnetType,
      },
      securityGroups: [securityGroup],
      credentials: rds.Credentials.fromSecret(this.secret),
      databaseName,
      instanceType,
      allocatedStorage,
      multiAz,
      publiclyAccessible: !isProduction, // Only public in development
      removalPolicy,
      deletionProtection,
      backupRetention,
      // Enable performance insights in production
      ...(isProduction && {
        performanceInsightRetention: rds.PerformanceInsightRetention.DEFAULT,
        enablePerformanceInsights: true,
      }),
      // Monitoring and maintenance
      monitoringInterval: isProduction ? cdk.Duration.minutes(1) : undefined,
      cloudwatchLogsExports: ['postgresql'],
    });

    // Store endpoint information
    this.endpoint = this.database.dbInstanceEndpointAddress;
    this.port = this.database.dbInstanceEndpointPort;

    // Grant the EC2 instance role access to the database secret
    // This will be used when we create the EC2 construct
  }
}
