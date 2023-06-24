import type { OnEventResponse } from 'aws-cdk-lib/custom-resources/lib/provider-framework/types';
import { CdkCustomResourceEvent } from 'aws-lambda';
import { WAFV2 } from 'aws-sdk';


export async function onEvent(
  event: CdkCustomResourceEvent,
) {
  console.log('Event 👉', event);
  let response: OnEventResponse;
  let webAclArn = event.ResourceProperties.webAclArn;
  let logGroupArn = event.ResourceProperties.logGroupArn;
  console.log(webAclArn);

  switch (event.RequestType) {
    case 'Create':
      response = await onCreate(event, webAclArn, logGroupArn);
      break;
    case 'Delete':
      response = await onDelete(event, webAclArn, logGroupArn);
      break;
    case 'Update':
      response = await onUpdate(event, webAclArn, logGroupArn);
      break;
    default:
      throw new Error('Unknown Request Type of CloudFormation.');
  }
  console.log('Return value:', JSON.stringify(response));
  return JSON.stringify(response);
}

async function onCreate(event: CdkCustomResourceEvent, webAclArn: string, logGroupArn: string) {
  console.log(`Creating logging configuration for WAFv2ACL ${webAclArn} and log ${logGroupArn}`);
  console.log(event);
  const resId = event.ResourceProperties.physicalResourceIdPart;
  const result = await updateLogGroupConfiguration(webAclArn, logGroupArn);
  console.log(result);
  return {
    PhysicalResourceId: `logbuster-${resId}`,
  };
}

async function onDelete(event: CdkCustomResourceEvent, webAclArn: string, logGroupArn: string) {
  console.log(`Deleting logging configuration forWAFv2ACL ${webAclArn} and log ${logGroupArn}`);
  await deleteLogGroupConfiguration(webAclArn);
  return {
    PhysicalResourceId: event.LogicalResourceId || '',
  };
}


async function onUpdate(event: CdkCustomResourceEvent, webAclArn: string, logGroupArn: string) {
  console.log(`Update logging configuration for WAFv2ACL ${webAclArn} and log ${logGroupArn}`);
  await updateLogGroupConfiguration(webAclArn, logGroupArn);
  return {
    PhysicalResourceId: event.LogicalResourceId || '',
  };
}

async function updateLogGroupConfiguration(wafAclArn: string, logGroupArn: string): Promise<void> {
  const waf = new WAFV2();

  const params: WAFV2.PutLoggingConfigurationRequest = {
    LoggingConfiguration: {
      LogDestinationConfigs: [
        logGroupArn,
      ],
      ResourceArn: wafAclArn,
    },
  };

  try {
    console.log('Call configuration updated.');
    const result = await waf.putLoggingConfiguration(params).promise();
    console.log('Logging configuration updated successfully');
    console.log(result);
  } catch (error) {
    console.error('Error updating logging configuration:', error);
    throw error;
  }
}

async function deleteLogGroupConfiguration(lwafAclArn: string): Promise<void> {
  const waf = new WAFV2();

  const params: WAFV2.DeleteLoggingConfigurationRequest = {
    ResourceArn: lwafAclArn,
  };

  try {
    const result = await waf.deleteLoggingConfiguration(params).promise();
    console.log('Logging configuration updated successfully.');
    console.log(result);
  } catch (error) {
    console.error('Error updating logging configuration:', error);
    throw error;
  }
}