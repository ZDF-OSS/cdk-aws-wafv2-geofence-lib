import * as cdk from 'aws-cdk-lib';

export interface IWafRuleProps {
  /** If you enable more than one Rule, AWS WAF evaluates each request against the Rules in order based on the value of Priority . AWS WAF processes rules with lower priority first. The priorities don’t need to be consecutive, but they must all be different. */
  priority: number;

  /** Instructs AWS WAF to block the web request. Link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-wafv2-webacl-ruleaction.html#cfn-wafv2-webacl-ruleaction-block */
  block: boolean;

  /** The Core rule set (CRS) rule group contains rules that are generally applicable to web applications. This provides protection against exploitation of a wide range of vulnerabilities, including some of the high risk and commonly occurring vulnerabilities described in OWASP publications such as OWASP Top 10. Consider using this rule group for any AWS WAF use case. */
  crsEnabled?: boolean;

  /** The Known bad inputs rule group contains rules to block request patterns that are known to be invalid and are associated with exploitation or discovery of vulnerabilities. This can help reduce the risk of a malicious actor discovering a vulnerable application. */
  kbiEnabled?: boolean;

  /** The SQL database rule group contains rules to block request patterns associated with exploitation of SQL databases, like SQL injection attacks. This can help prevent remote injection of unauthorized queries. Evaluate this rule group for use if your application interfaces with an SQL database. */
  sqliEnabled?: boolean;

  /** The Amazon IP reputation list rule group contains rules that are based on Amazon internal threat intelligence. This is useful if you would like to block IP addresses typically associated with bots or other threats. Blocking these IP addresses can help mitigate bots and reduce the risk of a malicious actor discovering a vulnerable application. */
  adminProtectEnabled?: boolean;

  /** The Amazon IP reputation list rule group contains rules that are based on Amazon internal threat intelligence. This is useful if you would like to block IP addresses typically associated with bots or other threats. Blocking these IP addresses can help mitigate bots and reduce the risk of a malicious actor discovering a vulnerable application. */
  ipReputationEnabled?: boolean;

  /** The Anonymous IP list rule group contains rules to block requests from services that permit the obfuscation of viewer identity. These include requests from VPNs, proxies, Tor nodes, and hosting providers. This rule group is useful if you want to filter out viewers that might be trying to hide their identity from your application. Blocking the IP addresses of these services can help mitigate bots and evasion of geographic restrictions. */
  anonIpListEnabled?: boolean;

  /** The Linux operating system rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to Linux, including Linux-specific Local File Inclusion (LFI) attacks. This can help prevent attacks that expose file contents or run code for which the attacker should not have had access. You should evaluate this rule group if any part of your application runs on Linux. You should use this rule group in conjunction with the POSIX operating system rule group. */
  linuxProtectionEnabled?: boolean;

  /** The POSIX operating system rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to POSIX and POSIX-like operating systems, including Local File Inclusion (LFI) attacks. This can help prevent attacks that expose file contents or run code for which the attacker should not have had access. You should evaluate this rule group if any part of your application runs on a POSIX or POSIX-like operating system, including Linux, AIX, HP-UX, macOS, Solaris, FreeBSD, and OpenBSD. */
  unixProtectionEnabled?: boolean;

  /** The PHP application rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to the use of the PHP programming language, including injection of unsafe PHP functions. This can help prevent exploitation of vulnerabilities that permit an attacker to remotely run code or commands for which they are not authorized. Evaluate this rule group if PHP is installed on any server with which your application interfaces. */
  phpProtectionEnabled?: boolean;

  /** The WordPress application rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to WordPress sites. You should evaluate this rule group if you are running WordPress. This rule group should be used in conjunction with the SQL database and PHP application rule groups. */
  wordpressProtectionEnabled?: boolean;

  /** The WordPress application rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to WordPress sites. You should evaluate this rule group if you are running WordPress. This rule group should be used in conjunction with the SQL database and PHP application rule groups. */
  windowsProtectionEnabled?: boolean;
}


export class WafRulesManagedBuilder {
  block: boolean;
  priority: number;
  badInput?: boolean = false;
  crsEnabled?: boolean = false;
  kbiEnabled?: boolean = false;
  sqliEnabled?: boolean = false;
  adminProtectEnabled?: boolean = false;
  anonIpListEnabled?: boolean = false;
  ipReputationEnabled?: boolean = false;
  linuxProtectionEnabled?: boolean = false;
  unixProtectionEnabled?: boolean = false;
  phpProtectionEnabled?: boolean = false;
  wordpressProtectionEnabled?: boolean = false;
  windowsProtectionEnabled?: boolean = false;
  waf_rules : Array<cdk.aws_wafv2.CfnWebACL.RuleProperty> = [];

  constructor(props: IWafRuleProps) {
    this.priority = props.priority;
    this.block = props.block;
    this.crsEnabled = props.crsEnabled;
    this.kbiEnabled = props.kbiEnabled;
    this.sqliEnabled = props.sqliEnabled;
    this.adminProtectEnabled = props.adminProtectEnabled;
    this.ipReputationEnabled = props.ipReputationEnabled;
    this.anonIpListEnabled = props.ipReputationEnabled;

    this.linuxProtectionEnabled = props.linuxProtectionEnabled;
    this.unixProtectionEnabled = props.unixProtectionEnabled;
    this.phpProtectionEnabled = props.phpProtectionEnabled;
    this.wordpressProtectionEnabled = props.wordpressProtectionEnabled;
    this.windowsProtectionEnabled = props.windowsProtectionEnabled;

    /** The Known bad inputs rule group contains rules to block request patterns that are known to be invalid and are associated with exploitation or discovery of vulnerabilities. This can help reduce the risk of a malicious actor discovering a vulnerable application. */
    let __aws_kbi_rule = (): cdk.aws_wafv2.CfnWebACL.RuleProperty => {
      return {
        name: 'AWSManagedRulesKnownBadInputsRuleSet',
        priority: this.priority + 1,
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: 'AWSManagedRulesKnownBadInputsRuleSet',
        },
        statement: {
          managedRuleGroupStatement:
          {
            vendorName: 'AWS',
            name: 'AWSManagedRulesKnownBadInputsRuleSet',

          },
        },
        overrideAction: {
          ...(this.block ? { none: {} }: { count: {} }),
        },
      };
    };

    /** The Core rule set (CRS) rule group contains rules that are generally applicable to web applications. This provides protection against exploitation of a wide range of vulnerabilities, including some of the high risk and commonly occurring vulnerabilities described in OWASP publications such as OWASP Top 10. Consider using this rule group for any AWS WAF use case. */
    let __aws_crs_rule = (): cdk.aws_wafv2.CfnWebACL.RuleProperty => {
      return {
        name: 'AWS-AWSManagedRulesCommonRuleSet',
        priority: this.priority + 2,
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: 'AWS-AWSManagedRulesCommonRuleSet',
        },
        statement: {
          managedRuleGroupStatement:
          {
            name: 'AWSManagedRulesCommonRuleSet',
            vendorName: 'AWS',
          },
        },
        overrideAction: {
          ...(this.block ? { none: {} }: { count: {} }),
        },
      };
    };

    /** The SQL database rule group contains rules to block request patterns associated with exploitation of SQL databases, like SQL injection attacks. This can help prevent remote injection of unauthorized queries. Evaluate this rule group for use if your application interfaces with an SQL database. */
    let __aws_sqli_rule = (): cdk.aws_wafv2.CfnWebACL.RuleProperty => {
      return {
        name: 'AWS-AWSManagedRulesSQLiRuleSet',
        priority: this.priority + 3,
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: 'AWS-AWSManagedRulesSQLiRuleSet',
        },
        statement: {
          managedRuleGroupStatement:
          {
            name: 'AWSManagedRulesSQLiRuleSet',
            vendorName: 'AWS',
          },
        },
        overrideAction: {
          ...(this.block ? { none: {} }: { count: {} }),
        },
      };
    };

    /** The Admin protection rule group contains rules that allow you to block external access to exposed administrative pages. This might be useful if you run third-party software or want to reduce the risk of a malicious actor gaining administrative access to your application. */
    let __aws_adminprotect_rule = (): cdk.aws_wafv2.CfnWebACL.RuleProperty => {
      return {
        name: 'AWS-AWSManagedRulesAdminProtectionRuleSet',
        priority: this.priority + 4,
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: 'AWS-AWSManagedRulesAdminProtectionRuleSet',
        },
        statement: {
          managedRuleGroupStatement:
          {
            name: 'AWSManagedRulesAdminProtectionRuleSet',
            vendorName: 'AWS',
          },
        },
        overrideAction: {
          ...(this.block ? { none: {} }: { count: {} }),
        },
      };
    };

    /** The Amazon IP reputation list rule group contains rules that are based on Amazon internal threat intelligence. This is useful if you would like to block IP addresses typically associated with bots or other threats. Blocking these IP addresses can help mitigate bots and reduce the risk of a malicious actor discovering a vulnerable application. */
    let __aws_ipreputation_rule = (): cdk.aws_wafv2.CfnWebACL.RuleProperty => {
      return {
        name: 'AWS-AWSManagedRulesAmazonIpReputationList',
        priority: this.priority + 5,
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: 'AWS-AWSManagedRulesAmazonIpReputationList',
        },
        statement: {
          managedRuleGroupStatement:
          {
            name: 'AWSManagedRulesAmazonIpReputationList',
            vendorName: 'AWS',
          },
        },
        overrideAction: {
          ...(this.block ? { none: {} }: { count: {} }),
        },
      };
    };

    /** The Anonymous IP list rule group contains rules to block requests from services that permit the obfuscation of viewer identity. These include requests from VPNs, proxies, Tor nodes, and hosting providers. This rule group is useful if you want to filter out viewers that might be trying to hide their identity from your application. Blocking the IP addresses of these services can help mitigate bots and evasion of geographic restrictions. */
    let __aws_anonip_rule = (): cdk.aws_wafv2.CfnWebACL.RuleProperty => {
      return {
        name: 'AWS-AWSManagedRulesAnonymousIpList',
        priority: this.priority + 6,
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: 'AWS-AWSManagedRulesAnonymousIpList',
        },
        statement: {
          managedRuleGroupStatement:
          {
            name: 'AWSManagedRulesAnonymousIpList',
            vendorName: 'AWS',
          },
        },
        overrideAction: {
          ...(this.block ? { none: {} }: { count: {} }),
        },
      };
    };

    /** The Linux operating system rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to Linux, including Linux-specific Local File Inclusion (LFI) attacks. This can help prevent attacks that expose file contents or run code for which the attacker should not have had access. You should evaluate this rule group if any part of your application runs on Linux. You should use this rule group in conjunction with the POSIX operating system rule group. */
    let __aws_lnx_rule = (): cdk.aws_wafv2.CfnWebACL.RuleProperty => {
      return {
        name: 'AWS-AWSManagedRulesLinuxRuleSet',
        priority: this.priority + 7,
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: 'AWS-AWSManagedRulesLinuxRuleSet',
        },
        statement: {
          managedRuleGroupStatement:
          {
            name: 'AWSManagedRulesLinuxRuleSet',
            vendorName: 'AWS',
          },
        },
        overrideAction: {
          ...(this.block ? { none: {} }: { count: {} }),
        },
      };
    };

    /** The POSIX operating system rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to POSIX and POSIX-like operating systems, including Local File Inclusion (LFI) attacks. This can help prevent attacks that expose file contents or run code for which the attacker should not have had access. You should evaluate this rule group if any part of your application runs on a POSIX or POSIX-like operating system, including Linux, AIX, HP-UX, macOS, Solaris, FreeBSD, and OpenBSD. */
    let __aws_unix_rule = (): cdk.aws_wafv2.CfnWebACL.RuleProperty => {
      return {
        name: 'AWS-AWSManagedRulesUnixRuleSet',
        priority: this.priority + 8,
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: 'AWS-AWSManagedRulesUnixRuleSet',
        },
        statement: {
          managedRuleGroupStatement:
          {
            name: 'AWSManagedRulesUnixRuleSet',
            vendorName: 'AWS',
          },
        },
        overrideAction: {
          ...(this.block ? { none: {} }: { count: {} }),
        },
      };
    };

    /** The Windows operating system rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to Windows, like remote execution of PowerShell commands. This can help prevent exploitation of vulnerabilities that permit an attacker to run unauthorized commands or run malicious code. Evaluate this rule group if any part of your application runs on a Windows operating system. */
    let __aws_win_rule = (): cdk.aws_wafv2.CfnWebACL.RuleProperty => {
      return {
        name: 'AWS-AWSManagedRulesWindowsRuleSet',
        priority: this.priority + 9,
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: 'AWS-AWSManagedRulesWindowsRuleSet',
        },
        statement: {
          managedRuleGroupStatement:
          {
            name: 'AWSManagedRulesWindowsRuleSet',
            vendorName: 'AWS',
          },
        },
        overrideAction: {
          ...(this.block ? { none: {} }: { count: {} }),
        },
      };
    };

    /** The PHP application rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to the use of the PHP programming language, including injection of unsafe PHP functions. This can help prevent exploitation of vulnerabilities that permit an attacker to remotely run code or commands for which they are not authorized. Evaluate this rule group if PHP is installed on any server with which your application interfaces. */
    let __aws_php_rule = (): cdk.aws_wafv2.CfnWebACL.RuleProperty => {
      return {
        name: 'AWS-AWSManagedRulesPHPRuleSet',
        priority: this.priority + 10,
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: 'AWS-AWSManagedRulesPHPRuleSet',
        },
        statement: {
          managedRuleGroupStatement:
          {
            name: 'AWSManagedRulesPHPRuleSet',
            vendorName: 'AWS',
          },
        },
        overrideAction: {
          ...(this.block ? { none: {} }: { count: {} }),
        },
      };
    };

    /** The WordPress application rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to WordPress sites. You should evaluate this rule group if you are running WordPress. This rule group should be used in conjunction with the SQL database and PHP application rule groups. */
    let __aws_wp_rule = (): cdk.aws_wafv2.CfnWebACL.RuleProperty => {
      return {
        name: 'AWS-AWSManagedRulesWordPressRuleSet',
        priority: this.priority + 11,
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: 'AWS-AWSManagedRulesWordPressRuleSet',
        },
        statement: {
          managedRuleGroupStatement:
          {
            name: 'AWSManagedRulesWordPressRuleSet',
            vendorName: 'AWS',
          },
        },
        overrideAction: {
          ...(this.block ? { none: {} }: { count: {} }),
        },
      };
    };

    this.crsEnabled && this.waf_rules.push(__aws_crs_rule());
    this.adminProtectEnabled && this.waf_rules.push(__aws_adminprotect_rule());
    this.anonIpListEnabled && this.waf_rules.push(__aws_anonip_rule());
    this.ipReputationEnabled && this.waf_rules.push(__aws_ipreputation_rule());
    this.kbiEnabled && this.waf_rules.push(__aws_kbi_rule());
    this.sqliEnabled && this.waf_rules.push(__aws_sqli_rule());
    this.linuxProtectionEnabled && this.waf_rules.push(__aws_lnx_rule());
    this.unixProtectionEnabled && this.waf_rules.push(__aws_unix_rule());
    this.windowsProtectionEnabled && this.waf_rules.push(__aws_win_rule());
    this.wordpressProtectionEnabled && this.waf_rules.push(__aws_wp_rule());
    this.phpProtectionEnabled && this.waf_rules.push(__aws_php_rule());
  }

  public rules(): Array<cdk.aws_wafv2.CfnWebACL.RuleProperty> {
    return this.waf_rules;
  }
}
