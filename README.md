![npm](https://img.shields.io/npm/dw/cdk-aws-wafv2-geofence-lib) ![GitHub last commit (branch)](https://img.shields.io/github/last-commit/ZDF-OSS/cdk-aws-wafv2-geofence-lib/main) ![GitHub issues](https://img.shields.io/github/issues/ZDF-OSS/cdk-aws-wafv2-geofence-lib)


# AWS WAFv2 cdk construct for Cloud Development Kit (AWS CDK)


The WAFv2 construct is free for everyone to use and it leverages the massive improvements made by AWS compared to V1. 

**Add an extra layer of security to protect your services from common attacks**

It offers a high-level abstraction and integrates neatly with your existing AWS CDK project. It brings AWS best practices into your infrastructure and hides boilerplate logic in your project.

**Features**
* Blocking of requests to your AWS ressources based on IP orign (Country) - If you application is national, restrict the web traffic to the county.

* AWS Managed Rules for AWS WAF is a managed service that provides protection against common application vulnerabilities or other unwanted traffic (https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-list.html)

* Cloud Watch Dashboards with AWS Logs Insights
  
**Experimental**
* ChatGPT IP blocking engine. IP Block list is maintained by ChatGPT evaluation.



The Construct is available in the following languages:

* JavaScript, TypeScript ([Node.js ≥ 14.15.0](https://nodejs.org/download/release/latest-v14.x/))
  * We recommend using a version in [Active LTS](https://nodejs.org/en/about/releases/)

Third-party Language Deprecation: language version is only supported until its EOL (End Of Life) shared by the vendor or community and is subject to change with prior notice.

![architecture](https://raw.githubusercontent.com/ZDF-OSS/cdk-aws-wafv2-geofence-lib/HEAD/assets/architecture.png)



  


![dashboard](https://raw.githubusercontent.com/ZDF-OSS/cdk-aws-wafv2-geofence-lib/HEAD/assets/dashboard.png)


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


#### Logging
Enabled logging sends all information to the CloudWatch LogGroup.

-------
## TL;TR;

Use our construct by installing the module and using our construct in your code:

```sh
npm install -g aws-cdk
npm install aws-cdk-lib 
npm install cdk-aws-wafv2-geofence-lib
```
**allowedCountiesToAccessService** expects an array of two-character country codes that you want to match against, for example, [ "US", "CN" ], from the alpha-2 country ISO codes of the ISO 3166 international standard.

When you use a geo match statement just for the region and country labels that it adds to requests, you still have to supply a country code for the rule to evaluate. In this case, you configure the rule to only count matching requests, but it will still generate logging and count metrics for any matches. You can reduce the logging and metrics that the rule produces by specifying a country that's unlikely to be a source of traffic to your site.  (https://docs.aws.amazon.com/waf/latest/APIReference/API_GeoMatchStatement.html)

```ts
  import { CdkWafGeoLib } from 'cdk-aws-wafv2-geofence-lib'
```

```ts
   // AWS WAFv2 GeoBlocking CDK Component
    const allowedCountiesToAccessService = ["DE"]
    new CdkWafGeoLib(this, 'Cdk-Waf-Geo-Lib', {
      // Geo blocking
      allowedCountiesToAccessService: ['DE'],
      enableGeoBlocking: false,

      resourceArn: lb.loadBalancerArn,
      priority: 233,

      // Cloud watch logs need to be enabled, if you want Dashboards and if you want to try the ChatGPT exp feature.
      enableCloudWatchLogs: true,

      // AWS Default WAF Rules
      enableAWSManagedRulesBlocking: true,
      // There are more AWS Managed rules to enable availible...
      enableAWSManagedRuleCRS: true,

      //ChatGPT blocking switch - dont forget to set the API Key in Secrets Manager after provisioning.// Get your API key from https://platform.openai.com/account/api-keys
      enableChatGPTBlocking: true,
      //Deploys the ChatGPT looging infrastructure. Dont toggle it of, if you want to keep your data.
      deployChatGPTBlocking: true,
    });
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                                                   | **Type**                                        | **Description**                                                                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.allowedCountiesToAccessService">allowedCountiesToAccessService</a></code>           | <code>string[]</code>                           | Allowed countries to access the backend - for example DE, EN, DK.                                                                                                                                                                      |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.deployChatGPTBlocking">deployChatGPTBlocking</a></code>                             | <code>boolean</code>                            | Switch to control if the rule should let ChatGPT block or count incomming requests.                                                                                                                                                    |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSManagedRulesBlocking">enableAWSManagedRulesBlocking</a></code>             | <code>boolean</code>                            | Switch to control if the rule should block or count incomming requests hitting the AWS Manged Rules.                                                                                                                                   |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableChatGPTBlocking">enableChatGPTBlocking</a></code>                             | <code>boolean</code>                            | Deploy ChatGPT blocking infrastructure e.g. DynamoDB, Lambdas, CW Rules.                                                                                                                                                               |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableGeoBlocking">enableGeoBlocking</a></code>                                     | <code>boolean</code>                            | Switch to control if the rule should block or count incomming requests.                                                                                                                                                                |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.priority">priority</a></code>                                                       | <code>number</code>                             | Priority of the WAFv2 rule.                                                                                                                                                                                                            |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.resourceArn">resourceArn</a></code>                                                 | <code>string</code>                             | Arn of the ressource to protect.                                                                                                                                                                                                       |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.block">block</a></code>                                                             | <code>boolean</code>                            | Deprecated: -  use enableGeoBlocking Switch to control if the rule should block or count incomming requests.                                                                                                                           |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.cloudWatchLogGroupName">cloudWatchLogGroupName</a></code>                           | <code>string</code>                             | Name of the CloudWatch LogGroup where requests are stored.                                                                                                                                                                             |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSManagedRuleCRS">enableAWSManagedRuleCRS</a></code>                         | <code>boolean</code>                            | The Core rule set (CRS) rule group contains rules that are generally applicable to web applications.                                                                                                                                   |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleAdminProtect">enableAWSMangedRuleAdminProtect</a></code>         | <code>boolean</code>                            | The Admin protection rule group contains rules that allow you to block external access to exposed administrative pages.                                                                                                                |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleAnonIP">enableAWSMangedRuleAnonIP</a></code>                     | <code>boolean</code>                            | The Anonymous IP list rule group contains rules to block requests from services that permit the obfuscation of viewer identity.                                                                                                        |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleIPRep">enableAWSMangedRuleIPRep</a></code>                       | <code>boolean</code>                            | The Amazon IP reputation list rule group contains rules that are based on Amazon internal threat intelligence.                                                                                                                         |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleKBI">enableAWSMangedRuleKBI</a></code>                           | <code>boolean</code>                            | The Known bad inputs rule group contains rules to block request patterns that are known to be invalid and are associated with exploitation or discovery of vulnerabilities.                                                            |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleLinuxProtect">enableAWSMangedRuleLinuxProtect</a></code>         | <code>boolean</code>                            | The Linux operating system rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to Linux, including Linux-specific Local File Inclusion (LFI) attacks.                   |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRulePHPProtect">enableAWSMangedRulePHPProtect</a></code>             | <code>boolean</code>                            | The PHP application rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to the use of the PHP programming language, including injection of unsafe PHP functions.        |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleSQLi">enableAWSMangedRuleSQLi</a></code>                         | <code>boolean</code>                            | The SQL database rule group contains rules to block request patterns associated with exploitation of SQL databases, like SQL injection attacks.                                                                                        |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleUnixProtect">enableAWSMangedRuleUnixProtect</a></code>           | <code>boolean</code>                            | The POSIX operating system rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to POSIX and POSIX-like operating systems, including Local File Inclusion (LFI) attacks. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleWindowsProtect">enableAWSMangedRuleWindowsProtect</a></code>     | <code>boolean</code>                            | The Windows operating system rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to Windows, like remote execution of PowerShell commands.                              |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleWorkpressProtect">enableAWSMangedRuleWorkpressProtect</a></code> | <code>boolean</code>                            | The WordPress application rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to WordPress sites.                                                                       |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableCloudWatchLogs">enableCloudWatchLogs</a></code>                               | <code>boolean</code>                            | Sends logs to a CloudWatch LogGroup with a retention on it.                                                                                                                                                                            |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.retentionDays">retentionDays</a></code>                                             | <code>aws-cdk-lib.aws_logs.RetentionDays</code> | Retention period to keep logs.                                                                                                                                                                                                         |
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
      //ChatGPT
      enableChatGPTBlocking: true,
      deployChatGPTBlocking: true,
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