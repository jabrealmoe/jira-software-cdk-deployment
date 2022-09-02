#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EtsOrgBlueprintStack } from '../lib/devops/stacks/ets-org-blueprint-stack';

const org = 'ets';
const environment = 'devops';
const secure_types = ["public", "database","app"];
const props = {
  org:org,
  environment: environment,
  secure_types: secure_types,
  cidr: '172.31.0.0/16',
  maxAzs: 2
}

const app = new cdk.App();
new EtsOrgBlueprintStack(app, 'EtsOrgBlueprintStack',  props);
