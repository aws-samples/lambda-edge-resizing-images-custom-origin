# Resizing Images with Lambda@Edge using the Custom Origin

You can resize the images and convert the image format by query parameters. This Lambda@Edge sample code using the custom origin as the original image source.

## Architecture

![Architecture](/images/image-resizing.png)

The Lambda@Edge function gets invoked only when there's a cache-miss. 
1. Derive the custom origin name from the origin defined for the CloudFront distribution.
2. Parse the image width and format needed from the querystring.
3. Using the request URI fetch the original image into buffer using the Node.js HTTP module.
4. Apply the resize transformation using the open source Sharp module packaged with the Lambda function.
5. Send a binary response of the resized image with appropriate status code and headers for content type and cache control headers.

## Prerequisites
* [Custom Origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistS3AndCustomOrigins.html#concept_CustomOrigin) (HTTPS): You need to have your custom origin. (Retrieve the original image from your custom origin). You will use the origin server name (Origin domain) as a parameter to CDK deploy.

* [AWS Cloud Development Kit (AWS CDK)](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html): You will deploy the project using AWS CDK.

## Deployment

Install dependencies
```
npm install
```
Install [Sharp](https://sharp.pixelplumbing.com/) for Lambda@Edge
```
cd resources
npm install --arch=x64 --platform=linux sharp
```
Go back to the root and run bootstrap the AWS CDK
```
npm run cdk -- bootstrap --region us-east-1 -c originName={Origin domain}
```
Deploy the stack
```
cdk deploy -c originName={Origin domain}
```
You can find the new CloudFront distribution once the deployment is successful. Please check the distribution settings and access the URL with the parameters below.

## Query Parameters
Resize and convert JPEG (*.jpg) images based on the query string parameters:
* width  : pixels (auto-scale the height to match the width)
* format : jpg or webp

`https://xxxxxx.cloudfront.net/image/test.jpg?width=240&format=jpg`

`https://xxxxxx.cloudfront.net/image/test.jpg?width=360&format=webp`

## Cleanup
You will need to [manually delete the Lamnbda@Edge function](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-delete-replicas.html) (CdkImageConverterStack-) then remove the stack with:
```
cdk destroy -c originName={Origin domain}
```

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.