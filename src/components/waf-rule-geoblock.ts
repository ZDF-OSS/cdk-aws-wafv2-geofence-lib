import * as cdk from 'aws-cdk-lib';

export interface IWafRuleProps {
  /** If you define more than one Rule in a WebACL , AWS WAF evaluates each request against the Rules in order based on the value of Priority . AWS WAF processes rules with lower priority first. The priorities don’t need to be consecutive, but they must all be different. */
  priority: number;

  /** Instructs AWS WAF to count the web request and then continue evaluating the request using the remaining rules in the web ACL. Link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleaction.html#cfn-wafv2-webacl-ruleaction-count */
  count: boolean;

  /** Instructs AWS WAF to block the web request. Link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleaction.html#cfn-wafv2-webacl-ruleaction-block */
  block: boolean;

  /** An array of two-character country codes that you want to match against, for example, [ "US", "CN" ], from the alpha-2 country ISO codes of the ISO 3166 international standard.
   * When you use a geo match statement just for the region and country labels that it adds to requests, you still have to supply a country code for the rule to evaluate. In this case, you configure the rule to only count matching requests, but it will still generate logging and count metrics for any matches. You can reduce the logging and metrics that the rule produces by specifying a country that's unlikely to be a source of traffic to your site. https://docs.aws.amazon.com/waf/latest/APIReference/API_GeoMatchStatement.html */
  allowed_countries: Array<string>;
}

export class WafRuleGeoBlockGreenList
implements cdk.aws_wafv2.CfnWebACL.RuleProperty, IWafRuleProps {
  allowed_countries: string[];
  count: boolean;
  block: boolean;
  action?:
  | cdk.aws_wafv2.CfnWebACL.RuleActionProperty
  | cdk.IResolvable
  | undefined;
  captchaConfig?:
  | cdk.IResolvable
  | cdk.aws_wafv2.CfnWebACL.CaptchaConfigProperty
  | undefined;
  challengeConfig?:
  | cdk.IResolvable
  | cdk.aws_wafv2.CfnWebACL.ChallengeConfigProperty
  | undefined;
  name: string;
  overrideAction?:
  | cdk.IResolvable
  | cdk.aws_wafv2.CfnWebACL.OverrideActionProperty
  | undefined;
  priority: number;
  ruleLabels?:
  | cdk.IResolvable
  | (cdk.IResolvable | cdk.aws_wafv2.CfnWebACL.LabelProperty)[]
  | undefined;
  statement: cdk.IResolvable | cdk.aws_wafv2.CfnWebACL.StatementProperty;
  visibilityConfig:
  | cdk.IResolvable
  | cdk.aws_wafv2.CfnWebACL.VisibilityConfigProperty;

  constructor(props: IWafRuleProps) {
    this.name = 'WafGeoBlockGreenList';
    if (props.block) {
      this.block = true;
      this.action = {
        block: {},
      };
    } else {
      this.action = {
        count: {},
      };
    }
    this.block = props.block;
    this.allowed_countries = props.allowed_countries;
    this.priority = props.priority;
    this.count = props.count;
    this.visibilityConfig = {
      sampledRequestsEnabled: true,
      cloudWatchMetricsEnabled: true,
      metricName: 'WafGeoBlockGreenList',
    };
    this.statement = {
      notStatement: {
        statement: {
          geoMatchStatement: {
            countryCodes: props.allowed_countries,
          },
        },
      },
    };
  }
}
