import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CdkWafGeoLib } from '../src';

const mockApp = new App();
const stack = new Stack(mockApp);
new CdkWafGeoLib(stack, 'Cdk-Waf-Geo-Lib', {
  allowedCountiesToAccessService: ['DE', 'EN'],
  resourceArn: 'some-arn',
  block: true,
  priority: 500,
});
const template = Template.fromStack(stack);

test('Should contain a WebACL ressource with a default action allow.', () => {
  template.hasResourceProperties('AWS::WAFv2::WebACL', {
    DefaultAction: {
      Allow: {},
    },
  });

  template.hasResourceProperties('AWS::WAFv2::WebACL',
    {
      Rules: [
        {
          Name: 'GeoBlockage',
          Priority: 500,
          Action: {
            Block: {},
          },
          Statement: {
            NotStatement: {
              Statement: {
                GeoMatchStatement: {
                  CountryCodes: ['DE', 'EN'],
                },
              },
            },
          },
          VisibilityConfig: {
            SampledRequestsEnabled: true,
            CloudWatchMetricsEnabled: true,
            MetricName: 'GeoBlock',
          },
        },
      ],
    });
});