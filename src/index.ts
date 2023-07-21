import { aws_wafv2 as wafv2 } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { CfnLoggingConfiguration } from 'aws-cdk-lib/aws-wafv2';
import { Construct } from 'constructs';
import { AutoBlock } from './components//autoblock';
import { ChatGPTWafLogEvaluation } from './components/chatgpt-waf-log-evaluation';
import { ChatGPTWafLogProcessor } from './components/chatgpt-waf-log-processor';
import { CloudWatchWAFDashboard } from './components/dashboard';
import { WafRulesGeoBlock } from './components/waf-rule-geoblock';
import { WafRulesManagedBuilder } from './components/waf-rule-managed';


export interface ICdkWafGeoLibProps {
  /** Arn of the ressource to protect. */
  resourceArn: string;
  /** Allowed countries to access the backend - for example DE, EN, DK */
  allowedCountiesToAccessService: Array<string>;
  //allowEUOnly?: boolean;
  //allowAllButWar?: boolean;
  /** Priority of the WAFv2 rule. */
  priority: number;
  /** Deprecated: -  use enableGeoBlocking Switch to control if the rule should block or count incomming requests. */
  block?: boolean;
  /** Sends logs to a CloudWatch LogGroup with a retention on it. If enabled you also get a CloudWatch Dashboard.*/
  enableCloudWatchLogs?: boolean;
  /** Name of the CloudWatch LogGroup where requests are stored. */
  cloudWatchLogGroupName?: string;
  /** Retention period to keep logs. ONE_MONTH is default. */
  retentionDays?: RetentionDays;

  /** Switch to control if the rule should block or count incomming requests. */
  enableGeoBlocking: boolean;
  /** Switch to control if the rule should let ChatGPT block or count incomming requests. */
  deployChatGPTBlocking: boolean;
  /** Deploy ChatGPT blocking infrastructure e.g. DynamoDB, Lambdas, CW Rules. */
  enableChatGPTBlocking: boolean;
  /** SNS Topic Arn of for sending notifications about ChatGPT Blocking results. */
  snsNotificationArn?: string;
  /** Switch to control if the rule should block or count incomming requests hitting the AWS Manged Rules. */
  enableAWSManagedRulesBlocking: boolean;
  /** The Core rule set (CRS) rule group contains rules that are generally applicable to web applications. This provides protection against exploitation of a wide range of vulnerabilities, including some of the high risk and commonly occurring vulnerabilities described in OWASP publications such as OWASP Top 10. Consider using this rule group for any AWS WAF use case. */
  enableAWSManagedRuleCRS?: boolean;
  /** The Amazon IP reputation list rule group contains rules that are based on Amazon internal threat intelligence. This is useful if you would like to block IP addresses typically associated with bots or other threats. Blocking these IP addresses can help mitigate bots and reduce the risk of a malicious actor discovering a vulnerable application. */
  enableAWSMangedRuleIPRep?: boolean;
  /** The Known bad inputs rule group contains rules to block request patterns that are known to be invalid and are associated with exploitation or discovery of vulnerabilities. This can help reduce the risk of a malicious actor discovering a vulnerable application. */
  enableAWSMangedRuleKBI?: boolean;
  /** The Anonymous IP list rule group contains rules to block requests from services that permit the obfuscation of viewer identity. These include requests from VPNs, proxies, Tor nodes, and hosting providers. This rule group is useful if you want to filter out viewers that might be trying to hide their identity from your application. Blocking the IP addresses of these services can help mitigate bots and evasion of geographic restrictions. */
  enableAWSMangedRuleAnonIP?: boolean;
  /** The Admin protection rule group contains rules that allow you to block external access to exposed administrative pages. This might be useful if you run third-party software or want to reduce the risk of a malicious actor gaining administrative access to your application. */
  enableAWSMangedRuleAdminProtect?: boolean;
  /** The SQL database rule group contains rules to block request patterns associated with exploitation of SQL databases, like SQL injection attacks. This can help prevent remote injection of unauthorized queries. Evaluate this rule group for use if your application interfaces with an SQL database. */
  enableAWSMangedRuleSQLi?: boolean;
  /** The Linux operating system rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to Linux, including Linux-specific Local File Inclusion (LFI) attacks. This can help prevent attacks that expose file contents or run code for which the attacker should not have had access. You should evaluate this rule group if any part of your application runs on Linux. You should use this rule group in conjunction with the POSIX operating system rule group. */
  enableAWSMangedRuleLinuxProtect?: boolean;
  /** The POSIX operating system rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to POSIX and POSIX-like operating systems, including Local File Inclusion (LFI) attacks. This can help prevent attacks that expose file contents or run code for which the attacker should not have had access. You should evaluate this rule group if any part of your application runs on a POSIX or POSIX-like operating system, including Linux, AIX, HP-UX, macOS, Solaris, FreeBSD, and OpenBSD. */
  enableAWSMangedRuleUnixProtect?: boolean;
  /** The Windows operating system rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to Windows, like remote execution of PowerShell commands. This can help prevent exploitation of vulnerabilities that permit an attacker to run unauthorized commands or run malicious code. Evaluate this rule group if any part of your application runs on a Windows operating system. */
  enableAWSMangedRuleWindowsProtect?: boolean;
  /** The PHP application rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to the use of the PHP programming language, including injection of unsafe PHP functions. This can help prevent exploitation of vulnerabilities that permit an attacker to remotely run code or commands for which they are not authorized. Evaluate this rule group if PHP is installed on any server with which your application interfaces. */
  enableAWSMangedRulePHPProtect?: boolean;
  /** The WordPress application rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to WordPress sites. You should evaluate this rule group if you are running WordPress. This rule group should be used in conjunction with the SQL database and PHP application rule groups. */
  enableAWSMangedRuleWorkpressProtect?: boolean;
}

export class CdkWafGeoLib extends Construct {
  public readonly customResourceResult?: string;
  constructor(scope: Construct, id: string, props: ICdkWafGeoLibProps) {
    super(scope, id);
    const logRetention = props.retentionDays ?? RetentionDays.ONE_MONTH;
    const logGroupName = `aws-waf-logs-geo-${props.cloudWatchLogGroupName ?? 'default'}`;
    const wafRules: Array<wafv2.CfnWebACL.RuleProperty> = [];

    if (props.enableGeoBlocking) {
      const wafGeoBlocking = new WafRulesGeoBlock( {
        block: ( props.block || props.enableGeoBlocking),
        priority: props.priority,
        allowed_countries: props.allowedCountiesToAccessService,
      }).rule();
      wafRules.push(wafGeoBlocking);
    }

    const log_group = new cdk.aws_logs.LogGroup(this, 'waf-log-group', {
      retention: logRetention,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      logGroupName,
    });

    const awsManagedRules = new WafRulesManagedBuilder(
      {
        block: props.enableAWSManagedRulesBlocking,
        priority: 200,
        adminProtectEnabled: props.enableAWSMangedRuleAdminProtect,
        anonIpListEnabled: props.enableAWSMangedRuleAnonIP,
        crsEnabled: props.enableAWSManagedRuleCRS,
        ipReputationEnabled: props.enableAWSMangedRuleIPRep,
        kbiEnabled: props.enableAWSMangedRuleKBI,
        sqliEnabled: props.enableAWSMangedRuleSQLi,
        linuxProtectionEnabled: props.enableAWSMangedRuleKBI,
        phpProtectionEnabled: props.enableAWSMangedRulePHPProtect,
        unixProtectionEnabled: props.enableAWSMangedRuleUnixProtect,
        windowsProtectionEnabled: props.enableAWSMangedRuleWindowsProtect,
        wordpressProtectionEnabled: props.enableAWSMangedRuleWorkpressProtect,
      }).rules();
    wafRules.push(...awsManagedRules);

    if (props.enableCloudWatchLogs && props.deployChatGPTBlocking) {
      const chatGPTBlocker = new AutoBlock(this, 'autoblocker', {
        block: true,
        priority: 1,
        rule_scope: 'REGIONAL',
      });
      wafRules.push(chatGPTBlocker.waf_rule);

      const logEvaluation = new ChatGPTWafLogEvaluation(this, 'waf-chatgpt-evaluation-component', {
        rule_scope: 'REGIONAL',
        log_group: log_group.logGroupName,
        chatgpt_log_check_intervall_minutes: 10,
        notification_sns_arn: props.snsNotificationArn ? props.snsNotificationArn : '',
      });

      new ChatGPTWafLogProcessor(this, 'waf-chatgpt-processor-component', {
        rule_scope: 'REGIONAL',
        dynamo_db_name: logEvaluation.table_name,
        ip_set_name: chatGPTBlocker.ip_set_name,
        chatgpt_log_process_intervall_minutes: 12,
      });
    }

    if ((props.enableCloudWatchLogs == false) && (props.deployChatGPTBlocking)) {
      throw ('Cannot deploy ChatGPT logging without enabling cloud watch logs.');
    }

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
      name: 'waf-workload-protection',
      description: 'This is a WAFv2 web acl that delivers geoblocking and aws managed rules for protecting your backends.',
      tags: [
        {
          key: 'cdk-component', value: 'cdk-wafv2-geoblock',
        },
      ],
      rules: [
        ...wafRules,
      ],
    });

    if (props.enableCloudWatchLogs) {
      // Create logging configuration with log group as destination
      new CfnLoggingConfiguration(scope, 'webAclLoggingConfiguration', {
        logDestinationConfigs: [
          cdk.Stack.of(this).formatArn({
            arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
            service: 'logs',
            resource: 'log-group',
            resourceName: log_group.logGroupName,
          }),
        ],
        resourceArn: cfnWebACL.attrArn,
      });

      new wafv2.CfnWebACLAssociation(this, 'WAFAssociation', {
        resourceArn: props.resourceArn,
        webAclArn: cfnWebACL.attrArn,
      });
      // END
      new CloudWatchWAFDashboard(this, 'waf-cloudwatch-dashboard', { cloudwatchLogName: log_group.logGroupName });
    }
  }
}
