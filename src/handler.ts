import * as lambda from 'aws-lambda';
import * as AWS from 'aws-sdk';

let sourceBucket = process.env.SOURCE_BUCKET as string;
let targetBucket = process.env.TARGET_BUCKET as string;

export const handler: lambda.S3Handler = async (event) => {
    const key = event.Records[0].s3.object.key;
    let s3 = new AWS.S3();
    console.log(`Copying ${key} from ${sourceBucket} to ${targetBucket}`);
    await s3.copyObject({Bucket: targetBucket, CopySource: `/${sourceBucket}/${key}`, Key: key}).promise();
};