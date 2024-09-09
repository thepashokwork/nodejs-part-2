import * as http from 'node:http';

const PORT: number = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  console.log(res.getHeader('Content-Type')); // text/plain
  console.log(res.getHeaderNames()); // [ 'content-type' ]
  console.log(res.hasHeader('Content-Type')); // true
  console.log(req.url); // /info
  console.log(req.method); // GET
  console.log(http.STATUS_CODES[403]); // 'Forbidden'

  if (req.url === '/') {
    res.end('Hello World!');
  } else if (req.url?.includes('/info')) {
    res.end('Welcome to info page');
  } else if (req.url === '/about') {
    res.end('Welcome to about page');
  } else {
    res.statusCode = 404;
    res.end('Page not found');
  }
});

server.listen(PORT, () => {
  console.log('Server is listening on port:', PORT);
});
