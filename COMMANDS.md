# Comandos Úteis - Igreja App

## 🚀 Desenvolvimento

### Iniciar o servidor de desenvolvimento
```bash
npm run dev
```
Acesse: http://localhost:3000

### Build de produção
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 🗄️ Banco de Dados (Prisma)

### Gerar cliente Prisma
```bash
npm run db:generate
# ou
npx prisma generate
```

### Aplicar schema ao banco
```bash
npm run db:push
# ou
npx prisma db push
```

### Popular banco com dados de exemplo
```bash
npm run db:seed
# ou
npx prisma db seed
```

### Interface visual do banco (Prisma Studio)
```bash
npm run db:studio
# ou
npx prisma studio
```
Acesse: http://localhost:5555

### Resetar banco de dados
```bash
npm run db:reset
# ou
npx prisma migrate reset
```

### Criar nova migração
```bash
npx prisma migrate dev --name nome_da_migracao
```

## 📦 Instalação Completa

### Setup inicial do projeto
```bash
# 1. Clonar repositório
git clone https://github.com/sua-organizacao/igreja-app.git
cd igreja-app

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 4. Configurar banco de dados
npm run db:generate
npm run db:push
npm run db:seed

# 5. Iniciar desenvolvimento
npm run dev
```

## 🚀 Deploy

### Vercel
```bash
# Instalar CLI da Vercel
npm i -g vercel

# Deploy
vercel

# Configurar variáveis de ambiente na Vercel
# Dashboard > Settings > Environment Variables

# Executar migrações em produção
vercel env pull .env.local
npx prisma db push
npx prisma db seed
```

### Docker
```bash
# Build da imagem
docker build -t igreja-app .

# Executar container
docker run -p 3000:3000 igreja-app

# Com docker-compose
docker-compose up -d
```

## 🔧 Manutenção

### Backup do banco de dados
```bash
# PostgreSQL
pg_dump -h localhost -U usuario -d igreja_db > backup.sql

# Restaurar backup
psql -h localhost -U usuario -d igreja_db < backup.sql
```

### Logs da aplicação
```bash
# Vercel
vercel logs

# Docker
docker logs container_name

# PM2 (se usando)
pm2 logs igreja-app
```

### Atualizar dependências
```bash
# Verificar dependências desatualizadas
npm outdated

# Atualizar todas
npm update

# Atualizar específica
npm install package@latest
```

## 🧪 Testes (quando implementados)

### Executar testes
```bash
npm test
```

### Testes em modo watch
```bash
npm run test:watch
```

### Coverage
```bash
npm run test:coverage
```

## 📊 Monitoramento

### Verificar status da aplicação
```bash
curl http://localhost:3000/api/health
```

### Métricas do banco
```bash
# Conectar ao PostgreSQL
psql -h localhost -U usuario -d igreja_db

# Verificar tamanho das tabelas
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

# Verificar conexões ativas
SELECT count(*) FROM pg_stat_activity;
```

## 🔐 Segurança

### Gerar nova chave secreta
```bash
# Para NEXTAUTH_SECRET
openssl rand -base64 32
```

### Verificar vulnerabilidades
```bash
npm audit
npm audit fix
```

## 📱 PWA

### Testar PWA localmente
1. Abra o Chrome DevTools
2. Vá para Application > Service Workers
3. Verifique se o service worker está registrado
4. Teste a funcionalidade offline

### Gerar ícones PWA
```bash
# Use uma ferramenta como PWA Asset Generator
# ou crie manualmente os ícones nos tamanhos:
# 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
```

## 🌐 Internacionalização

### Adicionar nova linguagem
1. Edite `src/utils/i18n.ts`
2. Adicione as traduções no objeto `translations`
3. Teste com `i18n.setLocale('novo-idioma')`

## 🚨 Troubleshooting

### Problemas comuns

#### Erro de conexão com banco
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Verificar variável DATABASE_URL
echo $DATABASE_URL
```

#### Erro de build
```bash
# Limpar cache do Next.js
rm -rf .next

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

#### Erro de permissões
```bash
# Verificar permissões do usuário no banco
# Conectar como superuser e executar:
GRANT ALL PRIVILEGES ON DATABASE igreja_db TO usuario;
```

#### Service Worker não atualiza
```bash
# Limpar cache do navegador
# Ou usar Chrome DevTools > Application > Storage > Clear storage
```

### Logs úteis

#### Verificar logs do Next.js
```bash
# Em desenvolvimento
npm run dev -- --debug

# Em produção (se usando PM2)
pm2 logs igreja-app --lines 100
```

#### Verificar logs do PostgreSQL
```bash
# Ubuntu/Debian
sudo tail -f /var/log/postgresql/postgresql-*.log

# CentOS/RHEL
sudo tail -f /var/lib/pgsql/data/log/postgresql-*.log
```

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs da aplicação
2. Consulte a documentação no README.md
3. Procure por issues similares no GitHub
4. Crie uma nova issue com detalhes do problema

---

**Dica**: Mantenha sempre backups regulares do banco de dados em produção!

