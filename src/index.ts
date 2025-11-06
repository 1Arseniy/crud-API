import http from 'http';

const server = http.createServer((request, response) => {
  //   response.end('Hello');
});

server.listen(3000);
