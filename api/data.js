const { list, put } = require('@vercel/blob');
const fallback = require('../data.json');

const pathname = 'content/site-data.json';

function valid(value) {
  return value && typeof value === 'object' && value.settings && Array.isArray(value.dogs) && Array.isArray(value.puppies);
}

function json(res, status, value) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  return res.end(JSON.stringify(value));
}

async function storedData() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return fallback;
  const { blobs } = await list({ prefix: pathname, limit: 1 });
  if (!blobs.length) return fallback;
  const response = await fetch(blobs[0].url, { cache: 'no-store' });
  if (!response.ok) return fallback;
  const content = await response.json();
  return valid(content) ? content : fallback;
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try { return json(res, 200, await storedData()); }
    catch { return json(res, 500, { error: 'Não foi possível carregar o conteúdo.' }); }
  }

  if (req.method !== 'PUT') return json(res, 405, { error: 'Método não permitido.' });
  if (!process.env.ADMIN_TOKEN || req.headers['x-admin-token'] !== process.env.ADMIN_TOKEN) return json(res, 401, { error: 'Não autorizado.' });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return json(res, 503, { error: 'Armazenamento ainda não configurado.' });
  if (!valid(req.body)) return json(res, 400, { error: 'Dados inválidos.' });

  try {
    await put(pathname, JSON.stringify(req.body), {
      access: 'public', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true,
      cacheControlMaxAge: 0
    });
    return json(res, 200, { ok: true });
  } catch { return json(res, 500, { error: 'Não foi possível salvar o conteúdo.' }); }
};
