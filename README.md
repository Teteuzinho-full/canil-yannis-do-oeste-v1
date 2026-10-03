# Canil Yannis do Oeste

Landing page responsiva com painel administrativo e API preparada para Vercel.

## Publicar na Vercel

1. Envie esta pasta a um repositório GitHub e importe-o na Vercel.
2. No projeto Vercel, abra **Storage → Create Database → Blob**. Escolha acesso **Public** e conecte-o ao projeto. A Vercel cria `BLOB_READ_WRITE_TOKEN` automaticamente.
3. Em **Settings → Environment Variables**, crie `ADMIN_TOKEN` com uma senha longa e exclusiva.
4. Faça o deploy. A primeira gravação pelo painel cria `content/site-data.json` no Blob; até lá, o site usa `data.json` como conteúdo inicial.

Não coloque `BLOB_READ_WRITE_TOKEN` ou `ADMIN_TOKEN` no código ou em arquivos enviados ao GitHub.

## Executar localmente

```powershell
$env:ADMIN_TOKEN='defina-uma-chave-forte-aqui'
node server.js
```

Abra `http://localhost:4173`. Para testar a persistência Blob localmente, conecte o projeto com `vercel link` e use `vercel env pull`.
