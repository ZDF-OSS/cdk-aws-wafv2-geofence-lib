
import * as cdk from 'aws-cdk-lib';

import { Construct } from 'constructs';

export interface IAutoBlockProps {
  priority: number;
  block: boolean;
  rule_scope: string;
}

export class AutoBlock extends Construct {
  waf_rule: cdk.aws_wafv2.CfnWebACL.RuleProperty;
  ip_set_id: string;
  ip_set_name: string;
  priority: number;
  block: boolean;
  rule_scope: string;
  constructor(scope: Construct, id: string, props: IAutoBlockProps) {
    super(scope, id);
    this.rule_scope = props.rule_scope;
    const ipset = new cdk.aws_wafv2.CfnIPSet(
      scope=this, 'waf-chatgpt-ipblock', {
        addresses: [],
        ipAddressVersion: 'IPV4',
        name: 'waf_ips_managed_by_chatgpt',
        scope: this.rule_scope,
        description: 'ChatGPT managed IPSet.',
      },
    );
    this.ip_set_id = ipset.attrId;
    this.ip_set_name = ipset.name!;
    this.priority = props.priority;
    this.block = props.block;
    this.waf_rule = {
      name: 'WafChatGPTIPBlocking',
      priority: this.priority,
      action: {
        ...(this.block ? {
          block: {
          },
        } : { count: {} }),
      },
      statement: {
        ipSetReferenceStatement:
        {
          arn: ipset.attrArn,
        },
      },
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'WafChatGPTIPBlocking',
      },
    };
  }
  public rule(): cdk.aws_wafv2.CfnWebACL.RuleProperty {
    return this.waf_rule;
  }
}
