import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Platform } from 'aws-cdk-lib/aws-ecr-assets';
import { Construct } from 'constructs';
import { CdkWafGeoLib } from './index';

export class EcsBpMicroserviceWaf extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const product = 'integ';

    const vpc = new cdk.aws_ec2.Vpc(this, 'integ-vpc', {
      ipAddresses: cdk.aws_ec2.IpAddresses.cidr('10.0.0.0/16'),
      maxAzs: 2,
      natGateways: 0,
    });

    const cluster = new cdk.aws_ecs.Cluster(this, 'integ-ecs-cluster', {
      clusterName: 'integ-ecs-cluster',
      vpc: vpc,
    });

    const task = new cdk.aws_ecs.FargateTaskDefinition(this, 'integ-td', {
      memoryLimitMiB: 512,
      cpu: 256,
      runtimePlatform: {
        operatingSystemFamily: cdk.aws_ecs.OperatingSystemFamily.LINUX,
        cpuArchitecture: cdk.aws_ecs.CpuArchitecture.ARM64,
      },
    });

    const imageAsset = new cdk.aws_ecr_assets.DockerImageAsset(
      this,
      'integ-image',
      {
        directory: path.join(__dirname, '../src/backend'),
        platform: Platform.LINUX_ARM64,
      },
    );

    const image = cdk.aws_ecs.ContainerImage.fromDockerImageAsset(imageAsset);
    task.addContainer('integ-container', {
      containerName: `${product}`,
      image,
      portMappings: [{ containerPort: 80 }],
      logging: cdk.aws_ecs.LogDriver.awsLogs({
        streamPrefix: `${product}`,
      }),
    });

    const sg = new cdk.aws_ec2.SecurityGroup(this, 'integ-sg', {
      vpc,
      allowAllOutbound: true,
    });
    sg.addIngressRule(
      cdk.aws_ec2.Peer.anyIpv4(),
      cdk.aws_ec2.Port.tcp(808),
      'Allowing traffic to the backend',
    );

    const service = new cdk.aws_ecs.FargateService(this, 'integ-service', {
      cluster,
      serviceName: `${product}-service`,
      taskDefinition: task,
      securityGroups: [sg],
      desiredCount: 1,
      assignPublicIp: false,
    });

    const lb = new cdk.aws_elasticloadbalancingv2.ApplicationLoadBalancer(this, 'integ-lb', {
      vpc,
      internetFacing: true,
      loadBalancerName: 'integ-lb',
    },
    );

    const listener = lb.addListener('integ-listener', {
      port: 808,
      protocol: cdk.aws_elasticloadbalancingv2.ApplicationProtocol.HTTP,
    });

    const tg = listener.addTargets('integ-targets', {
      port: 80,
      protocol: cdk.aws_elasticloadbalancingv2.ApplicationProtocol.HTTP,
      targets: [service],
      deregistrationDelay: cdk.Duration.seconds(1),
      targetGroupName: `${product}-targets`,
    });

    const scaling = service.autoScaleTaskCount({ maxCapacity: 10 });
    scaling.scaleOnRequestCount('RequestScaling', {
      requestsPerTarget: 500,
      targetGroup: tg,
    });

    new CdkWafGeoLib(this, 'Cdk-Waf-Geo-Lib', {
      // Geo blocking
      allowedCountiesToAccessService: ['DE'],
      enableGeoBlocking: false,
      resourceArn: lb.loadBalancerArn,
      priority: 233,
      enableCloudWatchLogs: true,
      // AWS Default WAF Rules
      enableAWSManagedRulesBlocking: true,
      enableAWSManagedRuleCRS: true,
      //ChatGPT
      enableChatGPTBlocking: true,
      deployChatGPTBlocking: true,
    });
  }
}
