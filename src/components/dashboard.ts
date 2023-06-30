import * as cdk from 'aws-cdk-lib';
import { LogQueryVisualizationType, LogQueryWidget } from 'aws-cdk-lib/aws-cloudwatch';
import * as cw from 'aws-cdk-lib/aws-cloudwatch';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export interface IDashboardProps {
  cloudwatchLogName: string;
}

export class CloudWatchWAFDashboard extends Construct {
  constructor(scope: Construct, id: string, props: IDashboardProps) {
    super(scope, id);

    new logs.QueryDefinition(this, 'waf-qd-allowed-requests', {
      queryDefinitionName: 'Allowed requests by country',
      logGroups: [
        logs.LogGroup.fromLogGroupName(
          this,
          'log-group-blocked',
          props.cloudwatchLogName,
        ),
      ],
      queryString: new logs.QueryString({
        stats: 'count(*) as countries by httpRequest.country',
        filterStatements: ['action = "ALLOW"'],
      }),
    });
    new logs.QueryDefinition(this, 'waf-qd-blocked-requests', {
      queryDefinitionName: 'Blocked requests by country',
      logGroups: [
        logs.LogGroup.fromLogGroupName(
          this,
          'log-group-allowed',
          props.cloudwatchLogName,
        ),
      ],
      queryString: new logs.QueryString({
        stats: 'count(*) as countries by httpRequest.country',
        filterStatements: ['action = "BLOCKED"'],
      }),
    });

    const blockedWidget = new LogQueryWidget({
      title: 'Blocked requests by Country',
      height: 12,
      width: 12,
      logGroupNames: [props.cloudwatchLogName],
      view: LogQueryVisualizationType.PIE,
      queryLines: [
        'filter action = "BLOCK"',
        'stats count(*) as countries by httpRequest.country',
      ],
    });
    const allowedWidget = new LogQueryWidget({
      title: 'Allowed requests by Country',
      height: 12,
      width: 12,
      logGroupNames: [props.cloudwatchLogName],
      view: LogQueryVisualizationType.PIE,
      queryLines: [
        'filter action = "ALLOW"',
        'stats count(*) as countries by httpRequest.country',
      ],
    });
    const blockedCount = new LogQueryWidget({
      title: 'Rules blocking requests',
      height: 8,
      width: 12,
      logGroupNames: [props.cloudwatchLogName],
      view: LogQueryVisualizationType.TABLE,
      queryLines: [
        'filter action = "BLOCK"',
        'stats count(*) as blockded by terminatingRuleId as rule',
      ],
    });

    const blockedAgents = new LogQueryWidget({
      title: 'Top 30 Blocked User-Agents',
      height: 8,
      width: 12,
      logGroupNames: [props.cloudwatchLogName],
      view: LogQueryVisualizationType.TABLE,
      queryLines: [
        'fields @timestamp, @message',
        'parse @message /(?i)"name":"user-agent","value":"(?<httpRequestUserAgent>[^"]+)/',
        'filter action == "ALLOW"',
        'stats count() as count by httpRequestUserAgent as UserAgent',
        'sort by count desc',
      ],
    });
    const allowedAgents = new LogQueryWidget({
      title: 'Top 30 Allowed User-Agents',
      height: 8,
      width: 12,
      logGroupNames: [props.cloudwatchLogName],
      view: LogQueryVisualizationType.TABLE,
      queryLines: [
        'fields @timestamp, @message',
        'parse @message /(?i)"name":"user-agent","value":"(?<httpRequestUserAgent>[^"]+)/',
        'filter action == "BLOCK"',
        'stats count() as count by httpRequestUserAgent as UserAgent',
        'sort by count desc',
      ],
    });
    const dashboard = new cw.Dashboard(this, 'Dash', {
      defaultInterval: cdk.Duration.days(7),
    });

    dashboard.addWidgets(blockedWidget);
    dashboard.addWidgets(allowedWidget);
    dashboard.addWidgets(blockedCount);
    dashboard.addWidgets(blockedAgents);
    dashboard.addWidgets(allowedAgents);

  }
}
