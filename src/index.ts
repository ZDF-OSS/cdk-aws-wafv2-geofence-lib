import { aws_wafv2 as wafv2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface ICdkWafGeoLibProps {
  resourceArn: string;
  allowedCountiesToAccessService: Array<string>;
}

export class CdkWafGeoLib extends Construct {
  constructor(scope: Construct, id: string, props: ICdkWafGeoLibProps) {
    super(scope, id);

    // WAF Setup
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
      name: 'zdf-waf-rules',
      rules: [
        {
          name: 'GeoBlockage',
          priority: 1,
          action: {
            block: {},
          },
          statement: {
            notStatement: {
              statement: {
                geoMatchStatement: {
                  countryCodes: props.allowedCountiesToAccessService,
                },
              },
            },
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'GeoBlock',
          },
        },
      ],
    });
    new wafv2.CfnWebACLAssociation(this, 'WAFAssociation', {
      resourceArn: props.resourceArn,
      webAclArn: cfnWebACL.attrArn,
    });
  }
}
