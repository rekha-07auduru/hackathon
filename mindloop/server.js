const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const root = process.cwd();

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(root, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = mime[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('error', () => {
      res.writeHead(500);
      res.end('Server error');
    });
  });
});

server.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}/`);
});
