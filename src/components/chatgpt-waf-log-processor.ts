
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

export interface IChatGPTWafLogProcessorProps {
  rule_scope: string;
  ip_set_name: string;
  dynamo_db_name: string;
  chatgpt_log_process_intervall_minutes: number;
}

export class ChatGPTWafLogProcessor extends Construct {
  ip_set_name: string;
  rule_scope: string;
  prefix: string;
  dynamo_db_name: string;
  chatgpt_log_process_intervall_minutes: number;
  constructor(scope: Construct, id: string, props: IChatGPTWafLogProcessorProps) {
    super(scope, id);
    this.rule_scope = props.rule_scope;
    this.prefix = 'alpha';
    this.ip_set_name = props.ip_set_name;
    this.dynamo_db_name = props.dynamo_db_name;
    this.chatgpt_log_process_intervall_minutes = props.chatgpt_log_process_intervall_minutes;

    /*
    Scheduled Lambda function
    Reads the DynamoDB
    Syncs an IPSet
    */
    //Define DynamoDB
    const table = dynamodb.Table.fromTableName(this, 'waf-dynamo-db', this.dynamo_db_name);
    const waf_log_processor_lambda_role = new iam.Role(
      this,
      'waf-chatgpt-processor-lambda-role',
      {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        description: 'Lambda role that reads DynamoDB and syncs WAFv2 IPSet.',
        managedPolicies: [
          cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
            'service-role/AWSLambdaBasicExecutionRole',
          ),
        ],
      },
    );
    waf_log_processor_lambda_role.addToPolicy(
      new iam.PolicyStatement({
        resources: ['*'],
        actions: ['wafv2:*'],
      }),
    );
    const waf_log_processor_lambda = new PythonFunction(
      this,
      'waf-log-check-lambda',
      {
        entry: './src/components/lambda/chatgpt_result_processor/',
        runtime: new lambda.Runtime(
          Runtime.PYTHON_3_10.name,
          lambda.RuntimeFamily.PYTHON,
        ),
        role: waf_log_processor_lambda_role,
        description:
            'Reads DynamoDB where IPs are listed by ChatBGP to block and blocks them bei syncing to an IPSet.',
        index: 'result_processor.py',
        architecture: Architecture.ARM_64,
        handler: 'handler',
        environment: {
          PRODUCT: 'ChatGPTBadIPs',
          DB_NAME: table.tableName,
          IP_SET_NAME: this.ip_set_name,
          SCOPE: this.rule_scope,
        },
        timeout: cdk.Duration.seconds(20),
      },
    );
    table.grantWriteData(waf_log_processor_lambda);
    table.grantReadData(waf_log_processor_lambda);
    new Rule(this, 'waf-chatgpt-analysis-rule', {
      description: 'Schedule for syncing ChatGPT DynamoDB results to an IPSet.',
      schedule: Schedule.rate(cdk.Duration.minutes(this.chatgpt_log_process_intervall_minutes)),
      targets: [new LambdaFunction(waf_log_processor_lambda)],
    });
  }
}
