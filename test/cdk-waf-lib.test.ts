import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CdkWafGeoLib } from '../src';

const mockApp = new App();
const stack = new Stack(mockApp);
new CdkWafGeoLib(stack, 'Cdk-Waf-Geo-Lib', {
  allowedCountiesToAccessService: ['DE'],
  resourceArn: 'some-arn',
});
const template = Template.fromStack(stack);

test('Lambda functions should be configured with properties and execution roles', () => {
  template.hasResourceProperties('AWS::WAFv2::WebACL', {
    DefaultAction: {
      Allow: {},
    },
  });
});