import { awscdk } from 'projen';

const PROJECT_NAME = 'cdk-aws-wafv2-geofence-lib';
const PROJECT_DESCRIPTION =
  'cdk-aws-wafv2-geofence-lib is an AWS CDK construct library that adds a AWS WAFv2 with GeoBlocking enabled for an AppSync, API Gateway or an ALB.';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'ZeroDotFive',
  authorAddress: 'ayoub.umoru@zerodotfive.com',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  authorOrganization: true,
  jsiiVersion: '~5.0.0',
  name: PROJECT_NAME,
  projenrcTs: true,
  repositoryUrl: 'https://github.com/ayoub.umoru/zdf_waf-geofence.git',
  description: PROJECT_DESCRIPTION,
  keywords: ['aws', 'cdk', 'awscdk', 'aws-cdk', 'wafv2', 'aws-waf', 'aws-wafv2', 'geoblock'],

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
