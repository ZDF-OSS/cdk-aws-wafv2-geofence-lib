# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### CdkWafGeoLib <a name="CdkWafGeoLib" id="cdk-aws-wafv2-geofence-lib.CdkWafGeoLib"></a>

#### Initializers <a name="Initializers" id="cdk-aws-wafv2-geofence-lib.CdkWafGeoLib.Initializer"></a>

```typescript
import { CdkWafGeoLib } from 'cdk-aws-wafv2-geofence-lib'

new CdkWafGeoLib(scope: Construct, id: string, props: ICdkWafGeoLibProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-aws-wafv2-geofence-lib.CdkWafGeoLib.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-aws-wafv2-geofence-lib.CdkWafGeoLib.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-aws-wafv2-geofence-lib.CdkWafGeoLib.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps">ICdkWafGeoLibProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-aws-wafv2-geofence-lib.CdkWafGeoLib.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-aws-wafv2-geofence-lib.CdkWafGeoLib.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-aws-wafv2-geofence-lib.CdkWafGeoLib.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps">ICdkWafGeoLibProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-aws-wafv2-geofence-lib.CdkWafGeoLib.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cdk-aws-wafv2-geofence-lib.CdkWafGeoLib.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-aws-wafv2-geofence-lib.CdkWafGeoLib.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-aws-wafv2-geofence-lib.CdkWafGeoLib.isConstruct"></a>

```typescript
import { CdkWafGeoLib } from 'cdk-aws-wafv2-geofence-lib'

CdkWafGeoLib.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-aws-wafv2-geofence-lib.CdkWafGeoLib.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-aws-wafv2-geofence-lib.CdkWafGeoLib.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.CdkWafGeoLib.property.customResourceResult">customResourceResult</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-aws-wafv2-geofence-lib.CdkWafGeoLib.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `customResourceResult`<sup>Optional</sup> <a name="customResourceResult" id="cdk-aws-wafv2-geofence-lib.CdkWafGeoLib.property.customResourceResult"></a>

```typescript
public readonly customResourceResult: string;
```

- *Type:* string

---




## Protocols <a name="Protocols" id="Protocols"></a>

### ICdkWafGeoLibProps <a name="ICdkWafGeoLibProps" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps"></a>

- *Implemented By:* <a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps">ICdkWafGeoLibProps</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.allowedCountiesToAccessService">allowedCountiesToAccessService</a></code> | <code>string[]</code> | Allowed countries to access the backend - for example DE, EN, DK. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.deployChatGPTBlocking">deployChatGPTBlocking</a></code> | <code>boolean</code> | Switch to control if the rule should let ChatGPT block or count incomming requests. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSManagedRulesBlocking">enableAWSManagedRulesBlocking</a></code> | <code>boolean</code> | Switch to control if the rule should block or count incomming requests hitting the AWS Manged Rules. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableChatGPTBlocking">enableChatGPTBlocking</a></code> | <code>boolean</code> | Deploy ChatGPT blocking infrastructure e.g. DynamoDB, Lambdas, CW Rules. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableGeoBlocking">enableGeoBlocking</a></code> | <code>boolean</code> | Switch to control if the rule should block or count incomming requests. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.priority">priority</a></code> | <code>number</code> | Priority of the WAFv2 rule. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.resourceArn">resourceArn</a></code> | <code>string</code> | Arn of the ressource to protect. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.block">block</a></code> | <code>boolean</code> | Deprecated: -  use enableGeoBlocking Switch to control if the rule should block or count incomming requests. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.cloudWatchLogGroupName">cloudWatchLogGroupName</a></code> | <code>string</code> | Name of the CloudWatch LogGroup where requests are stored. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSManagedRuleCRS">enableAWSManagedRuleCRS</a></code> | <code>boolean</code> | The Core rule set (CRS) rule group contains rules that are generally applicable to web applications. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleAdminProtect">enableAWSMangedRuleAdminProtect</a></code> | <code>boolean</code> | The Admin protection rule group contains rules that allow you to block external access to exposed administrative pages. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleAnonIP">enableAWSMangedRuleAnonIP</a></code> | <code>boolean</code> | The Anonymous IP list rule group contains rules to block requests from services that permit the obfuscation of viewer identity. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleIPRep">enableAWSMangedRuleIPRep</a></code> | <code>boolean</code> | The Amazon IP reputation list rule group contains rules that are based on Amazon internal threat intelligence. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleKBI">enableAWSMangedRuleKBI</a></code> | <code>boolean</code> | The Known bad inputs rule group contains rules to block request patterns that are known to be invalid and are associated with exploitation or discovery of vulnerabilities. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleLinuxProtect">enableAWSMangedRuleLinuxProtect</a></code> | <code>boolean</code> | The Linux operating system rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to Linux, including Linux-specific Local File Inclusion (LFI) attacks. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRulePHPProtect">enableAWSMangedRulePHPProtect</a></code> | <code>boolean</code> | The PHP application rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to the use of the PHP programming language, including injection of unsafe PHP functions. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleSQLi">enableAWSMangedRuleSQLi</a></code> | <code>boolean</code> | The SQL database rule group contains rules to block request patterns associated with exploitation of SQL databases, like SQL injection attacks. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleUnixProtect">enableAWSMangedRuleUnixProtect</a></code> | <code>boolean</code> | The POSIX operating system rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to POSIX and POSIX-like operating systems, including Local File Inclusion (LFI) attacks. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleWindowsProtect">enableAWSMangedRuleWindowsProtect</a></code> | <code>boolean</code> | The Windows operating system rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to Windows, like remote execution of PowerShell commands. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleWorkpressProtect">enableAWSMangedRuleWorkpressProtect</a></code> | <code>boolean</code> | The WordPress application rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to WordPress sites. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableCloudWatchLogs">enableCloudWatchLogs</a></code> | <code>boolean</code> | Sends logs to a CloudWatch LogGroup with a retention on it. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.retentionDays">retentionDays</a></code> | <code>aws-cdk-lib.aws_logs.RetentionDays</code> | Retention period to keep logs. |
| <code><a href="#cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.snsNotificationArn">snsNotificationArn</a></code> | <code>string</code> | SNS Topic Arn of for sending notifications about ChatGPT Blocking results. |

---

##### `allowedCountiesToAccessService`<sup>Required</sup> <a name="allowedCountiesToAccessService" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.allowedCountiesToAccessService"></a>

```typescript
public readonly allowedCountiesToAccessService: string[];
```

- *Type:* string[]

Allowed countries to access the backend - for example DE, EN, DK.

---

##### `deployChatGPTBlocking`<sup>Required</sup> <a name="deployChatGPTBlocking" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.deployChatGPTBlocking"></a>

```typescript
public readonly deployChatGPTBlocking: boolean;
```

- *Type:* boolean

Switch to control if the rule should let ChatGPT block or count incomming requests.

---

##### `enableAWSManagedRulesBlocking`<sup>Required</sup> <a name="enableAWSManagedRulesBlocking" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSManagedRulesBlocking"></a>

```typescript
public readonly enableAWSManagedRulesBlocking: boolean;
```

- *Type:* boolean

Switch to control if the rule should block or count incomming requests hitting the AWS Manged Rules.

---

##### `enableChatGPTBlocking`<sup>Required</sup> <a name="enableChatGPTBlocking" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableChatGPTBlocking"></a>

```typescript
public readonly enableChatGPTBlocking: boolean;
```

- *Type:* boolean

Deploy ChatGPT blocking infrastructure e.g. DynamoDB, Lambdas, CW Rules.

---

##### `enableGeoBlocking`<sup>Required</sup> <a name="enableGeoBlocking" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableGeoBlocking"></a>

```typescript
public readonly enableGeoBlocking: boolean;
```

- *Type:* boolean

Switch to control if the rule should block or count incomming requests.

---

##### `priority`<sup>Required</sup> <a name="priority" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.priority"></a>

```typescript
public readonly priority: number;
```

- *Type:* number

Priority of the WAFv2 rule.

---

##### `resourceArn`<sup>Required</sup> <a name="resourceArn" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.resourceArn"></a>

```typescript
public readonly resourceArn: string;
```

- *Type:* string

Arn of the ressource to protect.

---

##### `block`<sup>Optional</sup> <a name="block" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.block"></a>

```typescript
public readonly block: boolean;
```

- *Type:* boolean

Deprecated: -  use enableGeoBlocking Switch to control if the rule should block or count incomming requests.

---

##### `cloudWatchLogGroupName`<sup>Optional</sup> <a name="cloudWatchLogGroupName" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.cloudWatchLogGroupName"></a>

```typescript
public readonly cloudWatchLogGroupName: string;
```

- *Type:* string

Name of the CloudWatch LogGroup where requests are stored.

---

##### `enableAWSManagedRuleCRS`<sup>Optional</sup> <a name="enableAWSManagedRuleCRS" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSManagedRuleCRS"></a>

```typescript
public readonly enableAWSManagedRuleCRS: boolean;
```

- *Type:* boolean

The Core rule set (CRS) rule group contains rules that are generally applicable to web applications.

This provides protection against exploitation of a wide range of vulnerabilities, including some of the high risk and commonly occurring vulnerabilities described in OWASP publications such as OWASP Top 10. Consider using this rule group for any AWS WAF use case.

---

##### `enableAWSMangedRuleAdminProtect`<sup>Optional</sup> <a name="enableAWSMangedRuleAdminProtect" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleAdminProtect"></a>

```typescript
public readonly enableAWSMangedRuleAdminProtect: boolean;
```

- *Type:* boolean

The Admin protection rule group contains rules that allow you to block external access to exposed administrative pages.

This might be useful if you run third-party software or want to reduce the risk of a malicious actor gaining administrative access to your application.

---

##### `enableAWSMangedRuleAnonIP`<sup>Optional</sup> <a name="enableAWSMangedRuleAnonIP" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleAnonIP"></a>

```typescript
public readonly enableAWSMangedRuleAnonIP: boolean;
```

- *Type:* boolean

The Anonymous IP list rule group contains rules to block requests from services that permit the obfuscation of viewer identity.

These include requests from VPNs, proxies, Tor nodes, and hosting providers. This rule group is useful if you want to filter out viewers that might be trying to hide their identity from your application. Blocking the IP addresses of these services can help mitigate bots and evasion of geographic restrictions.

---

##### `enableAWSMangedRuleIPRep`<sup>Optional</sup> <a name="enableAWSMangedRuleIPRep" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleIPRep"></a>

```typescript
public readonly enableAWSMangedRuleIPRep: boolean;
```

- *Type:* boolean

The Amazon IP reputation list rule group contains rules that are based on Amazon internal threat intelligence.

This is useful if you would like to block IP addresses typically associated with bots or other threats. Blocking these IP addresses can help mitigate bots and reduce the risk of a malicious actor discovering a vulnerable application.

---

##### `enableAWSMangedRuleKBI`<sup>Optional</sup> <a name="enableAWSMangedRuleKBI" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleKBI"></a>

```typescript
public readonly enableAWSMangedRuleKBI: boolean;
```

- *Type:* boolean

The Known bad inputs rule group contains rules to block request patterns that are known to be invalid and are associated with exploitation or discovery of vulnerabilities.

This can help reduce the risk of a malicious actor discovering a vulnerable application.

---

##### `enableAWSMangedRuleLinuxProtect`<sup>Optional</sup> <a name="enableAWSMangedRuleLinuxProtect" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleLinuxProtect"></a>

```typescript
public readonly enableAWSMangedRuleLinuxProtect: boolean;
```

- *Type:* boolean

The Linux operating system rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to Linux, including Linux-specific Local File Inclusion (LFI) attacks.

This can help prevent attacks that expose file contents or run code for which the attacker should not have had access. You should evaluate this rule group if any part of your application runs on Linux. You should use this rule group in conjunction with the POSIX operating system rule group.

---

##### `enableAWSMangedRulePHPProtect`<sup>Optional</sup> <a name="enableAWSMangedRulePHPProtect" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRulePHPProtect"></a>

```typescript
public readonly enableAWSMangedRulePHPProtect: boolean;
```

- *Type:* boolean

The PHP application rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to the use of the PHP programming language, including injection of unsafe PHP functions.

This can help prevent exploitation of vulnerabilities that permit an attacker to remotely run code or commands for which they are not authorized. Evaluate this rule group if PHP is installed on any server with which your application interfaces.

---

##### `enableAWSMangedRuleSQLi`<sup>Optional</sup> <a name="enableAWSMangedRuleSQLi" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleSQLi"></a>

```typescript
public readonly enableAWSMangedRuleSQLi: boolean;
```

- *Type:* boolean

The SQL database rule group contains rules to block request patterns associated with exploitation of SQL databases, like SQL injection attacks.

This can help prevent remote injection of unauthorized queries. Evaluate this rule group for use if your application interfaces with an SQL database.

---

##### `enableAWSMangedRuleUnixProtect`<sup>Optional</sup> <a name="enableAWSMangedRuleUnixProtect" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleUnixProtect"></a>

```typescript
public readonly enableAWSMangedRuleUnixProtect: boolean;
```

- *Type:* boolean

The POSIX operating system rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to POSIX and POSIX-like operating systems, including Local File Inclusion (LFI) attacks.

This can help prevent attacks that expose file contents or run code for which the attacker should not have had access. You should evaluate this rule group if any part of your application runs on a POSIX or POSIX-like operating system, including Linux, AIX, HP-UX, macOS, Solaris, FreeBSD, and OpenBSD.

---

##### `enableAWSMangedRuleWindowsProtect`<sup>Optional</sup> <a name="enableAWSMangedRuleWindowsProtect" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleWindowsProtect"></a>

```typescript
public readonly enableAWSMangedRuleWindowsProtect: boolean;
```

- *Type:* boolean

The Windows operating system rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to Windows, like remote execution of PowerShell commands.

This can help prevent exploitation of vulnerabilities that permit an attacker to run unauthorized commands or run malicious code. Evaluate this rule group if any part of your application runs on a Windows operating system.

---

##### `enableAWSMangedRuleWorkpressProtect`<sup>Optional</sup> <a name="enableAWSMangedRuleWorkpressProtect" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableAWSMangedRuleWorkpressProtect"></a>

```typescript
public readonly enableAWSMangedRuleWorkpressProtect: boolean;
```

- *Type:* boolean

The WordPress application rule group contains rules that block request patterns associated with the exploitation of vulnerabilities specific to WordPress sites.

You should evaluate this rule group if you are running WordPress. This rule group should be used in conjunction with the SQL database and PHP application rule groups.

---

##### `enableCloudWatchLogs`<sup>Optional</sup> <a name="enableCloudWatchLogs" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.enableCloudWatchLogs"></a>

```typescript
public readonly enableCloudWatchLogs: boolean;
```

- *Type:* boolean

Sends logs to a CloudWatch LogGroup with a retention on it.

If enabled you also get a CloudWatch Dashboard.

---

##### `retentionDays`<sup>Optional</sup> <a name="retentionDays" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.retentionDays"></a>

```typescript
public readonly retentionDays: RetentionDays;
```

- *Type:* aws-cdk-lib.aws_logs.RetentionDays

Retention period to keep logs.

ONE_MONTH is default.

---

##### `snsNotificationArn`<sup>Optional</sup> <a name="snsNotificationArn" id="cdk-aws-wafv2-geofence-lib.ICdkWafGeoLibProps.property.snsNotificationArn"></a>

```typescript
public readonly snsNotificationArn: string;
```

- *Type:* string

SNS Topic Arn of for sending notifications about ChatGPT Blocking results.

---

