import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';

export interface LoadBalancerConstructProps {
  readonly vpc: ec2.IVpc;
  readonly securityGroup: ec2.ISecurityGroup;
  readonly instances?: ec2.Instance[];
  /**
   * Whether this is a production environment (affects load balancer type)
   * @default false
   */
  readonly isProduction?: boolean;
}

export class LoadBalancerConstruct extends Construct {
  public readonly loadBalancer: elbv2.ApplicationLoadBalancer;
  public readonly targetGroup: elbv2.ApplicationTargetGroup;

  constructor(scope: Construct, id: string, props: LoadBalancerConstructProps) {
    super(scope, id);

    const { vpc, securityGroup, instances = [], isProduction = false } = props;

    // Application Load Balancer
    this.loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'Alb', {
      vpc,
      internetFacing: true,
      securityGroup,
      // Use Network Load Balancer for production, ALB for development
      loadBalancerName: `famlink-alb-${isProduction ? 'prod' : 'dev'}`,
    });

    // Target group for EC2 instances
    this.targetGroup = new elbv2.ApplicationTargetGroup(this, 'TargetGroup', {
      vpc,
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetType: elbv2.TargetType.INSTANCE,
      healthCheck: {
        path: '/health', // Laravel health check endpoint
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 2,
      },
    });

    // Add instances to target group
    for (const instance of instances) {
      this.targetGroup.addTarget(new targets.InstanceTarget(instance, 80));
    }

    // HTTP listener
    const httpListener = this.loadBalancer.addListener('HttpListener', {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
    });

    httpListener.addAction('DefaultAction', {
      action: elbv2.ListenerAction.forward([this.targetGroup]),
    });

    // HTTPS listener (would need ACM certificate)
    // const httpsListener = this.loadBalancer.addListener('HttpsListener', {
    //   port: 443,
    //   protocol: elbv2.ApplicationProtocol.HTTPS,
    //   certificates: [certificate], // From ACM construct
    // });

    // httpsListener.addAction('DefaultAction', {
    //   action: elbv2.ListenerAction.forward([this.targetGroup]),
    // });
  }
}
