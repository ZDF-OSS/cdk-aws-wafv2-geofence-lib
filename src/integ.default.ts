import * as cdk from 'aws-cdk-lib';
import { CdkWafGeoLib } from './index';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'MyStack');

new CdkWafGeoLib(stack, 'Cdk-Waf-Geo-Lib', {
  allowedCountiesToAccessService: ['DE'],
  resourceArn: 'some-arn',
});