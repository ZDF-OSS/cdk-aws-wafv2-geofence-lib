import { aws_wafv2 as wafv2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface ICdkWafGeoLibProps {
  resourceArn: string;
  allowedCountiesToAccessService: Array<string>;
  priority: number;
  block: boolean;
}

export class CdkWafGeoLib extends Construct {
  constructor(scope: Construct, id: string, props: ICdkWafGeoLibProps) {
    super(scope, id);

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
      name: 'GeoBlockingWafRules',
      description: 'This is a WAFv2 web acl that delivers geoblocking for your backends.',
      tags: [
        {
          key: 'cdk-component', value: 'cdk-wafv2-geoblock',
        },
      ],
      rules: [
        {
          name: 'GeoBlockage',
          priority: props.priority,
          action: {
            ...props.block ? { block: {} } : { count: {} },
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
