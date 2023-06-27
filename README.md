# AWS WAFv2 cdk construct for Cloud Development Kit (AWS CDK)



The WAFv2 construct is free for everyone to use and it leverages the massive improvements made by AWS compared to V1. 

**Add an extra layer of security to protect your services from common attacks**

It offers a high-level abstraction and integrates neatly with your existing AWS CDK project. It brings AWS best practices into your infrastructure and hides boilerplate logic in your project.

The Construct is available in the following languages:

* JavaScript, TypeScript ([Node.js ≥ 14.15.0](https://nodejs.org/download/release/latest-v14.x/))
  * We recommend using a version in [Active LTS](https://nodejs.org/en/about/releases/)

Third-party Language Deprecation: language version is only supported until its EOL (End Of Life) shared by the vendor or community and is subject to change with prior notice.

**Features**
* Blocking of requests to your AWS ressources based on IP orign (Country) - If you application is national, restrict the web traffic to the county.

* AWS Managed Rules for AWS WAF is a managed service that provides protection against common application vulnerabilities or other unwanted traffic (https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-list.html)


***AWS Managed Rules***
AWS Managed Rules for AWS WAF is a managed service that provides protection against common application vulnerabilities or other unwanted traffic. You have the option of selecting one or more rule groups from AWS Managed Rules for each web ACL, up to the maximum web ACL capacity unit (WCU) limit.




\
Jump To:
[Getting Started](#getting-started)
[Getting Help](#getting-help)
[Contributing](#contributing)
[Roadmap](https://github.com/ZDF-OSS/cdk-aws-wafv2-geofence-lib/blob/main/ROADMAP.md)
[More Resources](#more-resources)

-------
## New features

* [2023] [Logs] - Added support for CloudWatch Logs als log destination for requests, with a default retention of 1 week

#### Logging
Enabled logging sends all information to the CloudWatch LogGroup.

-------
## TL;TR;

Use our construct by installing the module and using our construct in your code:

```sh
npm install cdk-aws-wafv2-geofence-lib
```
**allowedCountiesToAccessService** expects an array of two-character country codes that you want to match against, for example, [ "US", "CN" ], from the alpha-2 country ISO codes of the ISO 3166 international standard.

When you use a geo match statement just for the region and country labels that it adds to requests, you still have to supply a country code for the rule to evaluate. In this case, you configure the rule to only count matching requests, but it will still generate logging and count metrics for any matches. You can reduce the logging and metrics that the rule produces by specifying a country that's unlikely to be a source of traffic to your site.  (https://docs.aws.amazon.com/waf/latest/APIReference/API_GeoMatchStatement.html)

```ts
   // AWS WAFv2 GeoBlocking CDK Component
    const allowedCountiesToAccessService = ["DE"]
    new CdkWafGeoLib(this, 'Cdk-Waf-Geo-Lib', {
      // Geo blocking
      allowedCountiesToAccessService: allowedCountiesToAccessService,
      enableGeoBlocking: false,
      // AWS Default WAF Rules
      enableAWSManagedRulesBlocking: true,
      enableAWSManagedRuleCRS: true,

      priority: 100,
      resourceArn: lb.loadBalancerArn,
      enableCloudWatchLogs: true,
    });
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                                         | **Type**                                        | **Description**                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- | ----------------------------------------------------------------------- |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.allowedCountiesToAccessService">allowedCountiesToAccessService</a></code> | <code>string[]</code>                           | Allowed countries to access the backend - for example DE, EN, DK.       |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.block">block</a></code>                                                   | <code>boolean</code>                            | Switch to control if the rule should block or count incomming requests. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.priority">priority</a></code>                                             | <code>number</code>                             | Priority of the WAFv2 rule.                                             |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.resourceArn">resourceArn</a></code>                                       | <code>string</code>                             | Arn of the ressource to protect.                                        |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.cloudWatchLogGroupName">cloudWatchLogGroupName</a></code>                 | <code>string</code>                             | Name of the CloudWatch LogGroup where requests are stored.              |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableCloudWatchLogs">enableCloudWatchLogs</a></code>                     | <code>boolean</code>                            | Sends logs to a CloudWatch LogGroup with a retention on it.             |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.retentionDays">retentionDays</a></code>                                   | <code>aws-cdk-lib.aws_logs.RetentionDays</code> | Retention period to keep logs.                                          |

---
## Getting Started

Install or update the [AWS CDK CLI] from npm (requires [Node.js ≥ 14.15.0](https://nodejs.org/download/release/latest-v14.x/)). We recommend using a version in [Active LTS](https://nodejs.org/en/about/releases/) and then install the component

```sh
npm install -g aws-cdk
npm install aws-cdk-lib   
```

Initialize a project with our component:

```sh
mkdir hello-cdk
cd hello-cdk
cdk init sample-app --language=typescript
npm install cdk-aws-wafv2-geofence-lib
```

This creates a sample project - replace the sample code with:

```ts
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

    const lb = new cdk.aws_elasticloadbalancingv2.ApplicationLoadBalancer(
      this,
      'integ-lb',
      {
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
    });
  }
}

```

## Integration Testing

The integrations test deploys the solution with a microservice and a loadbalancer. The microservice runs inside an ecs cluster.

Deploy the solution for testing
```ts
cdk --app='./lib/integ.default.js' deploy
```

Destroy the solution 
```ts
cdk --app='./lib/integ.default.js' destroy
```


## Getting Help

The best way to interact with our team is through GitHub or mail. You can open an [issue](https://github.com/ZDF-OSS/cdk-aws-wafv2-geofence-lib/issues/new/choose) and choose from one of our templates for bug reports, feature requests, documentation issues.

## Roadmap
The project board lets developers know about our upcoming features and priorities to help them plan how to best leverage our construct
[Roadmap](https://github.com/ZDF-OSS/cdk-aws-wafv2-geofence-lib/blob/main/ROADMAP.md)

## Contributing

We welcome community contributions and pull requests.

## More Resources
* [License](./LICENSE)