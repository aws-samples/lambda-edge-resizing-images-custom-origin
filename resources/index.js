'use strict';

const https = require('https');
const Sharp = require('sharp');
const keepAliveAgent = new https.Agent({ keepAlive: true });

exports.handler = (event, context, callback) => {

  const request = event.Records[0].cf.request;
  // Read the custom origin name
  const originname = request.origin.custom.domainName;
  var resizingOptions = {};
  const params = new URLSearchParams(request.querystring);
  if (!params.has('width') || !params.has('format')) {
    // if there is no width parameter, just pass the request
    console.log("no params");
    callback(null, request);
    return;
  }
  resizingOptions.width = parseInt(params.get('width'));

  const options = {
    hostname: originname,
    port: 443,
    path: request.uri,
    method: 'GET',
    encoding: null,
    agent: keepAliveAgent
  }
  const req = https.request(options, function (res) {
    console.log(`statusCode: ${res.statusCode}`)
    console.log(options);
    console.log(params.get('format'));
    let chunks = [];
    res
      .on('data', (chunk) => {
        chunks.push(Buffer.from(chunk, 'binary'));
      })
      .on('end', () => {
        // Check the state code is 200 and file extension is jpg
        if (res.statusCode !== 200 || !request.uri.endsWith('\.jpg')) {
          req.destroy();
          callback(null, request);
          return;
        }
        const binary = Buffer.concat(chunks);
        try {
          // Generate a response with resized image
          Sharp(binary)
            .resize(resizingOptions)
            .toFormat(params.get('format'))
            .toBuffer()
            .then(output => {
              const base64String = output.toString('base64');
              console.log("Length of response :%s", base64String.length);
              if (base64String.length > 1048576) {
                //Resized filesize payload is greater than 1 MB.Returning original image
                console.error('Resized filesize payload is greater than 1 MB.Returning original image');
                callback(null, request);
                return;
              }

              const response = {
                status: '200',
                statusDescription: 'OK',
                headers: {
                  'cache-control': [{
                    key: 'Cache-Control',
                    value: 'max-age=86400'
                  }],
                  'content-type': [{
                    key: 'Content-Type',
                    value: 'image/' + params.get('format')
                  }]
                },
                bodyEncoding: 'base64',
                body: base64String
              };

              callback(null, response);
            });
        } catch (err) {
          // Image resize error
          console.error(err);
          callback(null, request);
        } finally {
          req.destroy();
        }
      });
  })
  req.end()
}
