const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlResponseHandler = require('./htmlResponses.js');
const jsonResponseHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlResponseHandler.getIndex,
    '/style.css': htmlResponseHandler.getCSS,
    '/getCharacters': jsonResponseHandler.getCharacters,
    notFound: jsonResponseHandler.notFound,
  },
};

const handlePost = (request, response, parsedURL) => {
  if (parsedURL.pathname === '/addCharacter') {
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonResponseHandler.updateCharacter(request, response, bodyParams);
    });
  }
};

const onRequest = (request, response) => {
  // Parse the request url
  const parsedURL = url.parse(request.url);

  // Determine if a POST or GET request is needed, or if something is wrong and it cannot be found
  if (request.method === 'POST') {
    handlePost(request, response, parsedURL);
  } else if (urlStruct[request.method][parsedURL.pathname]) {
    urlStruct[request.method][parsedURL.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);
