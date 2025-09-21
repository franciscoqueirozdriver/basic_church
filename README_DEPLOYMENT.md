# Guia de Deployment - Sistema de Gestão de Igreja

## Deployment no Vercel

### 1. Pré-requisitos

- Conta no Vercel (https://vercel.com)
- Banco de dados PostgreSQL (recomendado: Neon, Supabase ou Railway)
- Repositório Git (GitHub, GitLab ou Bitbucket)

### 2. Configuração do Banco de Dados

#### Opção A: Neon (Recomendado)
1. Acesse https://neon.tech
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Copie a string de conexão fornecida

#### Opção B: Supabase
1. Acesse https://supabase.com
2. Crie um novo projeto
3. Vá em Settings > Database
4. Copie a string de conexão

### 3. Deploy no Vercel

#### Via Dashboard do Vercel:
1. Acesse https://vercel.com/dashboard
2. Clique em "New Project"
3. Conecte seu repositório Git
4. Configure as variáveis de ambiente (ver seção abaixo)
5. Clique em "Deploy"

#### Via CLI do Vercel:
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 4. Variáveis de Ambiente Obrigatórias

Configure as seguintes variáveis no painel do Vercel:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database
DIRECT_URL=postgresql://username:password@host:port/database

# NextAuth
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=sua-chave-secreta-muito-forte-aqui

# Opcionais (para funcionalidades avançadas)
MAILGUN_API_KEY=sua-chave-mailgun
MAILGUN_DOMAIN=seu-dominio-mailgun
```

### 5. Configuração Pós-Deploy

Após o primeiro deploy bem-sucedido:

1. **Inicializar o banco de dados:**
   - O Prisma irá automaticamente aplicar as migrações
   - Execute o seed para dados iniciais (se necessário)

2. **Criar usuário administrador:**
   - Acesse `/login` no seu site
   - Use as credenciais padrão ou crie um novo usuário
   - Promova o usuário para ADMIN via banco de dados

3. **Configurar logo da igreja:**
   - Acesse `/settings`
   - Faça upload do logo da sua igreja
   - Configure as cores do tema

### 6. Domínio Personalizado (Opcional)

1. No painel do Vercel, vá em "Domains"
2. Adicione seu domínio personalizado
3. Configure os registros DNS conforme instruído
4. Atualize a variável `NEXTAUTH_URL` com o novo domínio

### 7. Monitoramento e Logs

- Acesse os logs em tempo real no painel do Vercel
- Configure alertas para erros críticos
- Monitore o uso de recursos e performance

### 8. Backup e Segurança

- Configure backups automáticos do banco de dados
- Mantenha as variáveis de ambiente seguras
- Atualize regularmente as dependências

### 9. Troubleshooting

#### Erro 404 nas páginas:
- Verifique se todas as páginas estão na pasta `src/app/(protected)`
- Confirme que o middleware está configurado corretamente

#### Erro de conexão com banco:
- Verifique a string de conexão `DATABASE_URL`
- Confirme que o banco está acessível publicamente

#### Erro de autenticação:
- Verifique `NEXTAUTH_SECRET` e `NEXTAUTH_URL`
- Confirme que a URL está correta (com https://)

### 10. Comandos Úteis

```bash
# Verificar build local
npm run build

# Executar localmente
npm run dev

# Verificar logs do Vercel
vercel logs

# Redeployar
vercel --prod
```

## Suporte

Para suporte técnico ou dúvidas sobre o deployment, consulte:
- Documentação do Vercel: https://vercel.com/docs
- Documentação do Next.js: https://nextjs.org/docs
- Issues do projeto no GitHub
