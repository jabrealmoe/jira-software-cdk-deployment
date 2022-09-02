import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';

import * as s3 from '@aws-cdk/aws-s3';
import * as ecs_pattern from '@aws-cdk/aws-ecs-patterns';

import { S3EnvironmentFile } from '@aws-cdk/aws-ecs';

export interface EtsNetworkStackProps extends cdk.StackProps {
  org: string,
  environment: string,
  cidr: string,
  maxAzs: number
}

export class EtsOrgBlueprintStack extends cdk.Stack {


  constructor(scope: cdk.Construct, id: string, props?: EtsNetworkStackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const clustername = `cluster-${props?.org}-${props?.environment}`

    const vpc = new ec2.Vpc(this, `${props?.org}-${props?.environment}-vpc`, {
      cidr: props?.cidr,
      maxAzs: props?.maxAzs,
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 28, //Specify 16 addresses - 5 for something i can understand
        },
        {
          name: 'app',
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
          cidrMask: 24, //Specify 256 addresses
        },
        {
          name: 'database',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 28, //DB should be isolated
        },
      ]
    })

    const cluster = new ecs.Cluster(this, `${clustername}`, {
      vpc: vpc,
      clusterName: `${clustername}`
    })

    new ecs_pattern.ApplicationLoadBalancedFargateService(this, `${props?.org}-${props?.environment}-Fargate-Service`, {
      cluster: cluster,
      cpu: 512,
      desiredCount: 2,
      taskImageOptions: {
        containerPort: 8080,
        image: ecs.ContainerImage.fromRegistry("atlassian/jira-software:latest")
      },
      memoryLimitMiB: 2048,
      publicLoadBalancer: true
    })

  }
}
