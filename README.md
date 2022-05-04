## Lambda@Edge function for resizing images with custom origin.

You can resize the images and convert the image format by query parameters. This Lambda@Edge sample code uses the custom origin as the original image source.

# Architecture

![Architecture](/images/image-resizing.png)

The Lambda@Edge function gets invoked only when there's a cache-miss. 
1. Derive the custom origin name from the origin defined for this CloudFront distribution.
2. Parse the image width and format needed from the querystring.
3. Using the request URI fetch the original image into buffer using the Node.js HTTP module.
4. Apply the resize transformation using the open source Sharp module packaged with the Lambda function.
5. Send a binary response of the resized image with appropriate status code and headers for content type and cache control headers.

# Prerequisites
* [Custom Origin](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistS3AndCustomOrigins.html#concept_CustomOrigin) (HTTPS): The origin server to which you can connect from the Internet. (Retrieve the original image from there).
The origin server name will be used as a parameter to CDK deploy.

* [AWS Cloud Development Kit (AWS CDK)](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html): We will deploy the project using AWS CDK.

# Deployment

Install dependencies
```
npm install
```
install [Sharp](https://sharp.pixelplumbing.com/) for Lambda@Edge
```
cd resources
npm install --arch=x64 --platform=linux sharp
```
Bootstrap the AWS CDK
```
cdk -- bootstrap --region us-east-1 -c originName={Origin Name}
```
Deploy the stack
```
cdk deploy -c originName={Origin Name}
```

## Query Parameters:
Resize images based on the query string parameter - width (pixel)  and format (jpg or webp).

`https://xxxxxx.cloudfront.net/image/test.jpg??width=240&format=jpg`

`https://xxxxxx.cloudfront.net/image/test.jpg?width=360&format=webp`

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.