# AWS WAFv2 GeoBlocking CDK construct for Cloud Development Kit (AWS CDK)



The WAFv2 GeoBlocking construct is free for everyone to use. It supports blocking of requests to AWS ressources based on IP orign (Country).

It offers a high-level abstraction and integrates neatly with your existing AWS CDK project. It encapsulates AWS best practices in your
infrastructure definition and hides boilerplate logic for your.

The Construct is available in the following languages:

* JavaScript, TypeScript ([Node.js ≥ 14.15.0](https://nodejs.org/download/release/latest-v14.x/))
  * We recommend using a version in [Active LTS](https://nodejs.org/en/about/releases/)


Third-party Language Deprecation: language version is only supported until its EOL (End Of Life) shared by the vendor or community and is subject to change with prior notice.

\
Jump To:
[Getting Started](#getting-started)
[Getting Help](#getting-help)
[Contributing](#contributing)
[Roadmap](https://github.com/ZDF-OSS/cdk-aws-wafv2-geofence-lib/blob/main/ROADMAP.md)
[More Resources](#more-resources)

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
    const geoblockingWaf = new CdkWafGeoLib(this, 'GeoblockingWaf',
    {
      allowedCountiesToAccessService: allowedCountiesToAccessService,
      resourceArn: lb.loadBalancerArn
    })
```
## Getting Started

Install or update the [AWS CDK CLI] from npm (requires [Node.js ≥ 14.15.0](https://nodejs.org/download/release/latest-v14.x/)). We recommend using a version in [Active LTS](https://nodejs.org/en/about/releases/) and then install the component

```sh
npm -g aws-cdk
```

(See [Manual Installation](./MANUAL_INSTALLATION.md) for installing the CDK from a signed .zip file).

Initialize a project with our component:

```sh
mkdir hello-cdk
cd hello-cdk
cdk init sample-app --language=typescript
npm install cdk-aws-wafv2-geofence-lib
```

This creates a sample project - replace the sample code with:

```ts
import * as cdk from "aws-cdk-lib";
import * as path from "path";
import { Construct } from "constructs";
import { Platform } from "aws-cdk-lib/aws-ecr-assets";
import { CdkWafGeoLib } from "cdk-aws-wafv2-geofence-lib"

export class EcsBpMicroservice extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const product = "bp-micro";
    
    const parameterValue = new cdk.CfnParameter(this, "LBName", {
      type: "String",
      default: "bp-micro-lb",
      description: "This is a parameter value.",
    });

    const vpc = new cdk.aws_ec2.Vpc(this, `bp-vpc`, {
      ipAddresses: cdk.aws_ec2.IpAddresses.cidr("10.0.0.0/16"),
      maxAzs: 2,
    });

    const cluster = new cdk.aws_ecs.Cluster(this, `bp-ecs-cluster`, {
      clusterName: `ecs-cluster`,
      vpc: vpc,
    });

    const imageAsset = new cdk.aws_ecr_assets.DockerImageAsset(
      this,
      `bp-image`,
      {
        directory: path.join(__dirname, "../../backend"),
        platform: Platform.LINUX_ARM64,
      }
    );

    const image = cdk.aws_ecs.ContainerImage.fromDockerImageAsset(imageAsset);

    const task = new cdk.aws_ecs.FargateTaskDefinition(this, `bp-td`, {
      memoryLimitMiB: 512,
      cpu: 256,
      runtimePlatform: {
        operatingSystemFamily: cdk.aws_ecs.OperatingSystemFamily.LINUX,
        cpuArchitecture: cdk.aws_ecs.CpuArchitecture.ARM64,
      },
    });

    const container = task.addContainer(`bp-container`, {
      containerName: `${product}`,
      image,
      portMappings: [{ containerPort: 80 }],
      logging: cdk.aws_ecs.LogDriver.awsLogs({
        streamPrefix: `${product}`,
      }),
    });
    const sg = new cdk.aws_ec2.SecurityGroup(this, `bp-sg`, {
      vpc,
      allowAllOutbound: true,
    });
    sg.addIngressRule(
      cdk.aws_ec2.Peer.anyIpv4(),
      cdk.aws_ec2.Port.tcp(808),
      "Allowing traffic to the backend"
    );

    const service = new cdk.aws_ecs.FargateService(this, `bp-service`, {
      cluster,
      serviceName: `${product}-service`,
      taskDefinition: task,
      securityGroups: [sg],
      desiredCount: 1,
      assignPublicIp: false,
    });

    const lb = new cdk.aws_elasticloadbalancingv2.ApplicationLoadBalancer(
      this,
      `bp-lb`,
      {
        vpc,
        internetFacing: true,
        loadBalancerName: parameterValue.valueAsString,
      }
    );

    const listener = lb.addListener(`bp-listener`, {
      port: 808,
      protocol: cdk.aws_elasticloadbalancingv2.ApplicationProtocol.HTTP,
    });

    const tg = listener.addTargets(`bp-targets`, {
      port: 80,
      protocol: cdk.aws_elasticloadbalancingv2.ApplicationProtocol.HTTP,
      targets: [service],
      deregistrationDelay: cdk.Duration.seconds(1),
      targetGroupName: `${product}-targets`,
    });

    const scaling = service.autoScaleTaskCount({ maxCapacity: 10 });
    scaling.scaleOnRequestCount("RequestScaling", {
      requestsPerTarget: 500,
      targetGroup: tg,
    });

    // AWS WAFv2 GeoBlocking CDK Component
    const allowedCountiesToAccessService = ["DE"]
    const geoblockingWaf = new CdkWafGeoLib(this, 'GeoblockingWaf',
    {
      allowedCountiesToAccessService: allowedCountiesToAccessService,
      resourceArn: lb.loadBalancerArn
    })
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