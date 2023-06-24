import * as path from 'path';
import { aws_wafv2 as wafv2 } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { WafRuleGeoBlockGreenList } from './components/waf-rule-geoblock';


export interface ICdkWafGeoLibProps {
  /** Arn of the ressource to protect. */
  resourceArn: string;
  allowedCountiesToAccessService: Array<string>;
  allowEUOnly?: boolean;
  allowAllButWar?: boolean;
  /** Priority of the WAFv2 rule. */
  priority: number;
  /** Switch to control if the rule should block or count incomming requests. */
  block: boolean;
  /** Sends logs to a CloudWatch LogGroup with a retention on it. */
  enableCloudWatchLogs?: boolean;
  /** Name of the CloudWatch LogGroup where requests are stored. */
  cloudWatchLogGroupName?: string;
  /** Retention period to keep logs. */
  retentionDays?: RetentionDays;
}
export class CdkWafGeoLib extends Construct {
  public readonly customResourceResult?: string;
  constructor(scope: Construct, id: string, props: ICdkWafGeoLibProps) {
    super(scope, id);

    const wafGeoBlocking = new WafRuleGeoBlockGreenList( {
      block: props.block,
      count: true,
      priority: props.priority,
      allowed_countries: props.allowedCountiesToAccessService,
    });

    const cfnWebACL = new wafv2.CfnWebACL(this, 'WafAcl', {
      defaultAction: {
        allow: {},
      },
      scope: 'REGIONAL',
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: 'WAF',
        sampledRequestsEnabled: true,
      },
      name: 'GeoBlocking',
      description: 'This is a WAFv2 web acl that delivers geoblocking for your backends.',
      tags: [
        {
          key: 'cdk-component', value: 'cdk-wafv2-geoblock',
        },
      ],
      rules: [
        wafGeoBlocking,
      ],
    });

    if (props.enableCloudWatchLogs) {
      // WAFv2 log specifics
      const customResourceRole = new cdk.aws_iam.Role(this, 'CustomResourceRole', {
        description: 'Custom Resource Construct Example',
        assumedBy: new cdk.aws_iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
          cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ],
      });
      const log_group = new cdk.aws_logs.LogGroup(this, 'waf-log-group', {
        retention: cdk.aws_logs.RetentionDays.ONE_WEEK,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        logGroupName: `aws-waf-logs-geo-${props.cloudWatchLogGroupName ?? 'default'}`,
      });
      customResourceRole.addToPolicy(new PolicyStatement({
        resources: ['*'],
        actions: [
          'wafv2:UpdateWebACL',
          'wafv2:GetLoggingConfiguration',
          'wafv2:ListLoggingConfiguration',
          'wafv2:PutLoggingConfiguration',
          'wafv2:DeleteLoggingConfiguration',
          'iam:CreateServiceLinkedRole',
        ],
      }));
      customResourceRole.addToPolicy(new PolicyStatement({
        resources: ['*'],
        actions: [
          'logs:CreateLogStream',
          'logs:CreateLogGroup',
          'logs:DeleteLogGroup',
          'logs:DescribeLogGroups',
          'logs:PutRetentionPolicy',
          'logs:GetLogEvents',
          'logs:PutLogEvents',
          'logs:CreateLogDelivery',
          'logs:PutResourcePolicy',
          'logs:DescribeResourcePolicies',
          'logs:UpdateLogDeliver',
          'logs:CreateLogDelivery',
          'logs:PutLogDelivery',
        ],
      }));


      const onEvent = new NodejsFunction(this, 'OnEventFunction', {
        runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
        handler: 'onEvent',
        role: customResourceRole,
        entry: path.join(__dirname, '../src/handler/event_handler.ts'),
        bundling: {
          minify: true,
          externalModules: ['aws-sdk', 'aws-lambda'],
        },
      });

      const customResourceProvider = new Provider(
        this,
        'customResourceProvider',
        {
          onEventHandler: onEvent,
        },
      );


      const customResourceResult = new cdk.CustomResource(
        this,
        'customResourceResult',
        {
          serviceToken: customResourceProvider.serviceToken,
          properties: {
            physicalResourceIdPart: 17,
            logGroupArn: log_group.logGroupArn,
            webAclArn: cfnWebACL.attrArn,
          },
        },
      );
      this.customResourceResult = customResourceResult.getAttString('Result');
      new wafv2.CfnWebACLAssociation(this, 'WAFAssociation', {
        resourceArn: props.resourceArn,
        webAclArn: cfnWebACL.attrArn,
      });
      // END
    }
  }
}
