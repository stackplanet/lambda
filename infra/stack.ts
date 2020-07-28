#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as lambda from '@aws-cdk/aws-lambda';
import { S3EventSource } from '@aws-cdk/aws-lambda-event-sources';

export class HandlerStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
            bucketName: `${this.account}-demo-source`
        });

        const targetBucket = new s3.Bucket(this, 'TargetBucket', {
            bucketName: `${this.account}-demo-target`
        });

        const handler = new lambda.Function(this, 'Handler', {
            runtime: lambda.Runtime.NODEJS_10_X,
            code: lambda.Code.fromAsset('dist'),
            handler: 'handler.handler',
            functionName: 'demo-handler',
            environment: {
                SOURCE_BUCKET: sourceBucket.bucketName,
                TARGET_BUCKET: targetBucket.bucketName,
            }
        });

        sourceBucket.grantRead(handler);
        targetBucket.grantWrite(handler);

        handler.addEventSource(new S3EventSource(sourceBucket as s3.Bucket, {
            events: [s3.EventType.OBJECT_CREATED]
        }));

        new cdk.CfnOutput(this, 'HandlerFunctionName', { value: handler.functionName });

    }
}

const app = new cdk.App();
new HandlerStack(app, 'HandlerStack');
