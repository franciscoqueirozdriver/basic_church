# 🚀 Guia de Instalação Rápida

## Instalação Local (5 minutos)

### 1. Pré-requisitos
```bash
# Verifique se tem Node.js 18+
node --version

# Verifique se tem npm
npm --version
```

### 2. Instalação
```bash
# Extraia o arquivo ZIP
unzip igreja-sistema-completo-final.zip
cd church-management

# Instale dependências
npm install

# Configure ambiente (SQLite para teste local)
cp .env.example .env

# Prepare banco de dados
npm run db:push
npm run db:seed

# Inicie o sistema
npm run dev
```

### 3. Acesse o Sistema
- URL: http://localhost:3000
- Email: admin@igreja.com
- Senha: admin123

## Deploy no Vercel (10 minutos)

### 1. Preparar Banco PostgreSQL
Escolha uma opção:
- **Neon** (gratuito): https://neon.tech
- **Supabase** (gratuito): https://supabase.com
- **Railway** (pago): https://railway.app

### 2. Deploy
```bash
# Instale Vercel CLI
npm i -g vercel

# Faça login
vercel login

# Deploy
vercel --prod
```

### 3. Configurar Variáveis
No painel do Vercel, adicione:
```
DATABASE_URL=postgresql://seu-banco-aqui
NEXTAUTH_SECRET=gere-um-secret-seguro
NEXTAUTH_URL=https://seu-app.vercel.app
```

### 4. Executar Migrações
```bash
# No terminal local, conectado ao banco de produção
DATABASE_URL="postgresql://..." npx prisma db push
DATABASE_URL="postgresql://..." npx prisma db seed
```

## ✅ Verificação

### Funcionalidades para Testar:
1. **Login** - admin@igreja.com / admin123
2. **Dashboard** - Estatísticas carregando
3. **Pessoas** - Adicionar nova pessoa
4. **Configurações** - Upload de logo
5. **Ofertas** - Registrar nova oferta

### Problemas Comuns:

**Erro de banco de dados:**
```bash
# Limpe e recrie
rm -f dev.db*
npm run db:push
npm run db:seed
```

**Erro de build:**
```bash
# Limpe cache
rm -rf .next
npm run build
```

**Erro de permissões:**
- Verifique se está logado como admin
- Teste com usuário admin@igreja.com

## 📞 Suporte Rápido

**Sistema não inicia:**
1. Verifique Node.js 18+
2. Delete node_modules e reinstale
3. Verifique arquivo .env

**Login não funciona:**
1. Execute npm run db:seed novamente
2. Verifique se banco foi criado
3. Use credenciais: admin@igreja.com / admin123

**Deploy falha:**
1. Verifique variáveis de ambiente
2. Confirme URL do banco PostgreSQL
3. Execute migrações após deploy

---

**🎉 Pronto! Seu sistema de gestão de igreja está funcionando!**
