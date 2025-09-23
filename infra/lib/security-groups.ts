import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface SecurityGroupsConstructProps {
  readonly vpc: ec2.IVpc;
  /**
   * Whether this is a production environment (affects security rules)
   * @default false
   */
  readonly isProduction?: boolean;
}

export class SecurityGroupsConstruct extends Construct {
  public readonly albSecurityGroup: ec2.SecurityGroup;
  public readonly ec2SecurityGroup: ec2.SecurityGroup;
  public readonly rdsSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: SecurityGroupsConstructProps) {
    super(scope, id);

    const { vpc, isProduction = false } = props;

    // Application Load Balancer Security Group
    this.albSecurityGroup = new ec2.SecurityGroup(this, 'AlbSecurityGroup', {
      vpc,
      description: 'Security group for Application Load Balancer',
      allowAllOutbound: true,
    });

    // Allow HTTP and HTTPS from anywhere (or restrict in production)
    this.albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'HTTP access from anywhere'
    );

    this.albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'HTTPS access from anywhere'
    );

    // EC2 Security Group for Laravel application
    this.ec2SecurityGroup = new ec2.SecurityGroup(this, 'Ec2SecurityGroup', {
      vpc,
      description: 'Security group for EC2 instances running Laravel',
      allowAllOutbound: true,
    });

    // Allow HTTP/HTTPS from ALB
    this.ec2SecurityGroup.addIngressRule(
      this.albSecurityGroup,
      ec2.Port.tcp(80),
      'HTTP access from ALB'
    );

    this.ec2SecurityGroup.addIngressRule(
      this.albSecurityGroup,
      ec2.Port.tcp(443),
      'HTTPS access from ALB'
    );

    // Allow SSH access (restrict to specific IPs in production)
    if (!isProduction) {
      this.ec2SecurityGroup.addIngressRule(
        ec2.Peer.anyIpv4(),
        ec2.Port.tcp(22),
        'SSH access from anywhere (dev only)'
      );
    }

    // RDS Security Group
    this.rdsSecurityGroup = new ec2.SecurityGroup(this, 'RdsSecurityGroup', {
      vpc,
      description: 'Security group for RDS PostgreSQL database',
      allowAllOutbound: true,
    });

    // Allow PostgreSQL access from EC2 instances
    this.rdsSecurityGroup.addIngressRule(
      this.ec2SecurityGroup,
      ec2.Port.tcp(5432),
      'PostgreSQL access from EC2 instances'
    );

    // In development, allow access from anywhere for easier development
    // In production, this should be restricted
    if (!isProduction) {
      this.rdsSecurityGroup.addIngressRule(
        ec2.Peer.anyIpv4(),
        ec2.Port.tcp(5432),
        'PostgreSQL access from anywhere (dev only)'
      );
    }
  }
}
