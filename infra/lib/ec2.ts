import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

export interface Ec2ConstructProps {
  readonly vpc: ec2.IVpc;
  readonly securityGroup: ec2.ISecurityGroup;
  readonly instanceProfile: iam.CfnInstanceProfile;
  readonly instanceType?: ec2.InstanceType;
  readonly keyName?: string;
  /**
   * Whether this is a production environment
   * @default false
   */
  readonly isProduction?: boolean;
}

export class Ec2Construct extends Construct {
  public readonly instance: ec2.Instance;
  public readonly instanceId: string;

  constructor(scope: Construct, id: string, props: Ec2ConstructProps) {
    super(scope, id);

    const {
      vpc,
      securityGroup,
      instanceProfile,
      instanceType = ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      keyName,
      isProduction = false,
    } = props;

    // EC2 instance for Laravel application
    this.instance = new ec2.Instance(this, 'LaravelInstance', {
      vpc,
      instanceType,
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      securityGroup,
      keyName,
      vpcSubnets: {
        subnetType: isProduction
          ? ec2.SubnetType.PRIVATE_WITH_EGRESS
          : ec2.SubnetType.PUBLIC,
      },
      // Associate the IAM instance profile
      role: iam.Role.fromRoleName(this, 'InstanceRole', instanceProfile.instanceProfileName!),
    });

    this.instanceId = this.instance.instanceId;

    // User data script to install and configure Laravel environment
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      '#!/bin/bash',
      'yum update -y',
      '# Install PHP 8.3 and required extensions',
      'yum install -y php php-cli php-fpm php-mysqlnd php-pgsql php-xml php-mbstring php-curl php-zip php-gd',
      '# Install Nginx',
      'yum install -y nginx',
      '# Install Git',
      'yum install -y git',
      '# Install Composer',
      'curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer',
      '# Install Node.js and npm (for frontend builds)',
      'curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -',
      'yum install -y nodejs',
      '# Install PM2 for process management',
      'npm install -g pm2',
      '# Configure Nginx (basic Laravel configuration)',
      'cat > /etc/nginx/conf.d/laravel.conf << EOF',
      'server {',
      '    listen 80;',
      '    server_name _;',
      '    root /var/www/html/public;',
      '    index index.php index.html;',
      '    location / {',
      '        try_files $uri $uri/ /index.php?$query_string;',
      '    }',
      '    location ~ \\.php$ {',
      '        fastcgi_pass unix:/var/run/php-fpm/php-fpm.sock;',
      '        fastcgi_index index.php;',
      '        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;',
      '        include fastcgi_params;',
      '    }',
      '}',
      'EOF',
      '# Start services',
      'systemctl enable nginx',
      'systemctl enable php-fpm',
      'systemctl start nginx',
      'systemctl start php-fpm',
    );

    this.instance.addUserData(userData.render());

    // Allow SSH access if key is provided and not production
    if (keyName && !isProduction) {
      // Key pair is already handled via keyName prop
    }
  }
}
