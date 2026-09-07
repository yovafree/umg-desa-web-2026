const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'html' });
  res.end('<h1>Hola Mundo\n</h1>');
});

server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});