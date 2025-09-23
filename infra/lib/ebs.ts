import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface EbsConstructProps {
  readonly instance: ec2.Instance;
  /**
   * Size of the EBS volume in GB
   * @default 20
   */
  readonly size?: number;
  /**
   * EBS volume type
   * @default gp3
   */
  readonly volumeType?: ec2.EbsDeviceVolumeType;
  /**
   * Whether to encrypt the volume
   * @default true
   */
  readonly encrypted?: boolean;
}

export class EbsConstruct extends Construct {
  public readonly volume: ec2.Volume;

  constructor(scope: Construct, id: string, props: EbsConstructProps) {
    super(scope, id);

    const {
      instance,
      size = 20,
      volumeType = ec2.EbsDeviceVolumeType.GP3,
      encrypted = true,
    } = props;

    // Additional EBS volume for application data
    this.volume = new ec2.Volume(this, 'AppDataVolume', {
      availabilityZone: instance.instanceAvailabilityZone,
      size: cdk.Size.gibibytes(size),
      volumeType,
      encrypted,
    });

    // Attach the volume to the instance
    const volumeAttachment = new ec2.CfnVolumeAttachment(this, 'AppDataVolumeAttachment', {
      instanceId: instance.instanceId,
      volumeId: this.volume.volumeId,
      device: '/dev/sdf', // /dev/xvdf when attached
    });

    // Note: Volume will need to be formatted and mounted via user data script
    // This would typically be done in the EC2 construct's user data
  }
}
