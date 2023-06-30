import { awscdk } from 'projen';

const PROJECT_NAME = 'cdk-aws-wafv2-geofence-lib';
const PROJECT_DESCRIPTION =
  'The cdk-aws-wafv2-geofence-lib is an AWS CDK construct library that adds a AWS WAFv2 with GeoBlocking and AWS Managed Rules for AppSync, API Gateway or an ALB.';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'ZeroDotFive',
  authorAddress: 'ayoub.umoru@zerodotfive.com',
  cdkVersion: '2.84.0',
  majorVersion: 1,
  defaultReleaseBranch: 'main',
  authorOrganization: true,
  jsiiVersion: '~5.0.0',
  name: PROJECT_NAME,
  projenrcTs: true,
  repositoryUrl: 'https://github.com/ZDF-OSS/cdk-aws-wafv2-geofence-lib.git',
  homepage: 'https://zerodotfive.com',
  description: PROJECT_DESCRIPTION,
  keywords: ['aws', 'cdk', 'awscdk', 'aws-cdk', 'wafv2', 'aws-waf', 'aws-wafv2', 'geoblock'],
  gitignore: [
    'cdk.out/',
  ],
});

project.addBundledDeps('@types/aws-lambda');
project.addBundledDeps('aws-sdk');
project.synth();
