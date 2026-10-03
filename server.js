const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname, dataFile = path.join(root, 'data.json');
const adminToken = process.env.ADMIN_TOKEN;
const types = { '.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8' };
function read(){ return JSON.parse(fs.readFileSync(dataFile, 'utf8')); }
function send(res,status,body,type='application/json; charset=utf-8'){ res.writeHead(status,{'Content-Type':type,'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'}); res.end(body); }
http.createServer((req,res)=>{
  const url = new URL(req.url, 'http://localhost');
  if(url.pathname === '/api/data' && req.method === 'GET') return send(res,200,JSON.stringify(read()));
  if(url.pathname === '/api/data' && req.method === 'PUT') { if(!adminToken || req.headers['x-admin-token'] !== adminToken) return send(res,401,JSON.stringify({error:'Não autorizado'})); let body=''; req.on('data',c=>{ body+=c; if(body.length>1e6) req.destroy(); }); req.on('end',()=>{ try { const next=JSON.parse(body); if(!next.settings || !Array.isArray(next.dogs) || !Array.isArray(next.puppies)) throw Error(); fs.writeFileSync(dataFile,JSON.stringify(next,null,2)); send(res,200,JSON.stringify({ok:true})); } catch { send(res,400,JSON.stringify({error:'Dados inválidos'})); } }); return; }
  const requested = url.pathname === '/' ? '/index.html' : url.pathname;
  const file = path.normalize(path.join(root, requested));
  if(!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return send(res,404,'Não encontrado','text/plain; charset=utf-8');
  send(res,200,fs.readFileSync(file),types[path.extname(file)] || 'application/octet-stream');
}).listen(process.env.PORT || 4173,()=>console.log('Canil Yannis em http://localhost:4173'));
