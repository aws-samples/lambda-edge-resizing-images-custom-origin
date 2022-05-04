#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkImageConverterStack } from '../lib/cdk-image-converter-stack';

const app = new cdk.App();
new CdkImageConverterStack(app, 'CdkImageConverterStack', {
  env: {
    region: 'us-east-1',
  },
});