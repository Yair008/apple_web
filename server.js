import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 4172);

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

function resolvePath(urlPath) {
  const pathname = urlPath === '/' ? '/index.html' : urlPath;
  const normalized = path.normalize(path.join(__dirname, pathname));

  if (!normalized.startsWith(__dirname)) {
    return null;
  }

  return normalized;
}

const server = http.createServer(async (request, response) => {
  const filePath = resolvePath(request.url || '/');

  if (!filePath || !existsSync(filePath)) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  const fileStat = await stat(filePath);
  if (!fileStat.isFile()) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  const ext = path.extname(filePath);
  response.writeHead(200, {
    'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
  });
  createReadStream(filePath).pipe(response);
});

server.listen(PORT, () => {
  console.log(`iPhone Aura promo page available at http://localhost:${PORT}`);
});
