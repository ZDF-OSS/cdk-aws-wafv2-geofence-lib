
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
//import * as logs from 'aws-cdk-lib/aws-logs'
//import * as cw from 'aws-cdk-lib/aws-cloudwatch'
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface IChatGPTWafLogEvaluationProps {
  rule_scope: string;
  log_group: string;
  chatgpt_log_check_intervall_minutes: number;
}

export class ChatGPTWafLogEvaluation extends Construct {
  rule_scope: string;
  table_name: string;
  prefix: string;
  log_group: string;
  chatgpt_log_check_intervall_minutes: number;
  constructor(scope: Construct, id: string, props: IChatGPTWafLogEvaluationProps) {
    super(scope, id);
    this.rule_scope = props.rule_scope;
    this.prefix = 'alpha';
    this.log_group = props.log_group;
    this.chatgpt_log_check_intervall_minutes = props.chatgpt_log_check_intervall_minutes;

    //Define DynamoDB
    const table = new dynamodb.Table(this, 'waf-autoblock-db', {
      tableName: `${this.prefix}-waf_ip_protection`,
      partitionKey: { name: 'ip', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'product', type: dynamodb.AttributeType.STRING },
    });
    this.table_name = table.tableName;

    const waf_log_checker_lambda_role = new iam.Role(
      this,
      'waf-log-checker-lambda-role',
      {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        description: 'Lambda role that checks WAFv2 logs, talks to ChatGPT and stores results to DynamoDB.',
        managedPolicies: [
          cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
            'service-role/AWSLambdaBasicExecutionRole',
          ),
        ],
      },
    );

    const chatGPTAPISecret = new cdk.aws_secretsmanager.Secret(
      this,
      'waf-chatgpt-secret',
      {
        description: 'Secret for ChatGPT API',
        secretName: `${this.prefix}-chatgpt-api-key`,
      },
    );
    waf_log_checker_lambda_role.addToPolicy(
      new iam.PolicyStatement({
        resources: ['*'],
        actions: ['logs:*'],
      }),
    );
    const waf_log_analysis_lambda = new PythonFunction(
      this,
      'waf-log-check-lambda',
      {
        entry: './src/components/lambda/waf_logs_chatgpt/',
        runtime: new lambda.Runtime(
          Runtime.PYTHON_3_10.name,
          lambda.RuntimeFamily.PYTHON,
        ),
        role: waf_log_checker_lambda_role,
        description:
            'Reads WAFv2 logs, makes ChatGPT evaluations and stores the results DynamoDB.',
        index: 'inspect_waf_logs.py',
        architecture: Architecture.ARM_64,
        handler: 'handler',
        environment: {
          PRODUCT: 'ChatGPTBadIPs',
          DB_NAME: table.tableName,
          SCOPE: this.rule_scope,
          LOG_GROUP: this.log_group,
          SECRET_ID: chatGPTAPISecret.secretName,
          LAST_LOG_MINUTES: this.chatgpt_log_check_intervall_minutes.toString(),
        },
        timeout: cdk.Duration.minutes(6),
      },
    );
    chatGPTAPISecret.grantRead(waf_log_analysis_lambda);
    table.grantWriteData(waf_log_analysis_lambda);
    table.grantReadData(waf_log_analysis_lambda);
    new Rule(this, 'waf-chatgpt-analysis-rule', {
      description: 'Schedule for the ChatGPT log analysis.',
      schedule: Schedule.rate(cdk.Duration.minutes(this.chatgpt_log_check_intervall_minutes)),
      targets: [new LambdaFunction(waf_log_analysis_lambda)],
    });
  }
}