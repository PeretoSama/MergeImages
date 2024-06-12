const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');

const server = http.createServer((req, res) => {
  console.log('Request recived');
});

server.listen(0, () => {
  console.log('Server listening');
});
