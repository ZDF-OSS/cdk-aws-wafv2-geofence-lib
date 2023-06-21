import * as cdk from 'aws-cdk-lib';
import { EcsBpMicroserviceWaf } from './integ.ecs-bp-microservice-waf';

const app = new cdk.App();

new EcsBpMicroserviceWaf(app, 'EcsBpMicroserviceWaf', {});
