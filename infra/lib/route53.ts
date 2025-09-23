import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

export interface Route53ConstructProps {
  /**
   * Domain name for the application
   * @example famlink.example.com
   */
  readonly domainName: string;

  /**
   * Load balancer to route traffic to (optional)
   */
  readonly loadBalancer?: elbv2.ILoadBalancerV2;

  /**
   * Whether to create a hosted zone (set to false if using existing hosted zone)
   * @default true
   */
  readonly createHostedZone?: boolean;

  /**
   * Existing hosted zone ID (if not creating a new one)
   */
  readonly hostedZoneId?: string;
}

export class Route53Construct extends Construct {
  public readonly hostedZone: route53.IHostedZone;
  public readonly record: route53.ARecord | undefined;

  constructor(scope: Construct, id: string, props: Route53ConstructProps) {
    super(scope, id);

    const { domainName, loadBalancer, createHostedZone = true, hostedZoneId } = props;

    // Create or import hosted zone
    if (createHostedZone) {
      this.hostedZone = new route53.HostedZone(this, 'HostedZone', {
        zoneName: domainName,
      });
    } else if (hostedZoneId) {
      this.hostedZone = route53.HostedZone.fromHostedZoneId(this, 'HostedZone', hostedZoneId);
    } else {
      throw new Error('Either createHostedZone must be true or hostedZoneId must be provided');
    }

    // Create A record pointing to load balancer (if provided)
    if (loadBalancer) {
      this.record = new route53.ARecord(this, 'AliasRecord', {
        zone: this.hostedZone,
        target: route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(loadBalancer)),
        recordName: domainName,
      });
    }

    // Additional records can be added here:
    // - CNAME for www subdomain
    // - TXT records for domain verification
    // - MX records for email
    // - etc.
  }
}
