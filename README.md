# Canil Yannis do Oeste

Landing page responsiva com API local, carrossel, galeria/lightbox, CTAs de WhatsApp e painel de conteúdo.

## Executar

No PowerShell, defina uma chave administrativa e inicie o servidor:

```powershell
$env:ADMIN_TOKEN='defina-uma-chave-forte-aqui'
node server.js
```

Abra `http://localhost:4173`. A Área administrativa solicita essa mesma chave e grava o conteúdo em `data.json`.

Antes de publicar, atualize em `data.json`: WhatsApp, Instagram, localização, fotos reais, cães, filhotes e metadados de domínio. As fotos de demonstração devem ser substituídas pelas fotografias autorizadas do canil.
