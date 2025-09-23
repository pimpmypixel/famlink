import { Construct } from 'constructs';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';

export interface AcmConstructProps {
  /**
   * Domain name for the certificate
   * @example famlink.example.com
   */
  readonly domainName: string;

  /**
   * Route 53 hosted zone for DNS validation
   */
  readonly hostedZone: route53.IHostedZone;

  /**
   * Additional subject alternative names
   * @example ['www.famlink.example.com', 'api.famlink.example.com']
   */
  readonly subjectAlternativeNames?: string[];
}

export class AcmConstruct extends Construct {
  public readonly certificate: acm.Certificate;

  constructor(scope: Construct, id: string, props: AcmConstructProps) {
    super(scope, id);

    const { domainName, hostedZone, subjectAlternativeNames = [] } = props;

    // SSL Certificate for HTTPS
    this.certificate = new acm.Certificate(this, 'Certificate', {
      domainName,
      subjectAlternativeNames,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // Certificate will be validated via DNS records in the hosted zone
    // This enables automatic renewal when the certificate expires
  }
}
