# Igreja App - Sistema de Gestão de Igreja

Um sistema completo de gestão para igrejas desenvolvido com Next.js 14, Prisma, NextAuth e PostgreSQL.

## 🚀 Funcionalidades

### 📊 **Dashboard Inteligente**
- Visão geral das atividades da igreja
- Estatísticas em tempo real
- Gráficos e métricas importantes
- Atividades recentes e próximos eventos

### 👥 **Gestão de Pessoas**
- Cadastro completo de membros
- Organização por famílias
- Controle de dados pessoais e contato
- Histórico de participação
- Fotos e documentos

### ⛪ **Controle de Presença**
- Check-in rápido em serviços
- Busca por nome ou QR Code
- Relatórios de frequência
- Estatísticas de participação
- Alertas de ausências

### 💰 **Gestão de Ofertas**
- Registro de coletas (cultos, células, campanhas)
- **Integração PIX** com QR Code e copia-e-cola
- Reconciliação automática de pagamentos
- Geração de recibos em PDF
- Relatórios anuais por pessoa
- Exportação para CSV
- Dashboard financeiro

### 👨‍👩‍👧‍👦 **Grupos e Células**
- CRUD completo de grupos
- Sistema de presença por encontro
- Inscrição self-service
- Lembretes automáticos
- Comunicação com membros
- Alertas de faltas consecutivas

### 📅 **Eventos**
- Criação e gestão de eventos
- Sistema de inscrições
- Controle de capacidade
- Cobrança de taxas
- Relatórios de participação

### 📧 **Sistema de Comunicação**
- Templates personalizáveis
- Envio por email (Mailgun) e WhatsApp
- Segmentação avançada
- Métricas de entrega e abertura
- Webhooks para status
- Campanhas automatizadas

### 🔐 **Controle de Acesso (RBAC)**
- 6 níveis de permissão:
  - **Admin**: Acesso total
  - **Pastor**: Gestão geral
  - **Tesouraria**: Ofertas e finanças
  - **Coord. Grupos**: Grupos e células
  - **Recepção**: Pessoas e presença
  - **Membro**: Acesso limitado

### 📱 **PWA (Progressive Web App)**
- Instalável em dispositivos móveis
- Funciona offline
- Notificações push
- Interface responsiva

### 🌐 **Internacionalização**
- Suporte completo ao português brasileiro
- Sistema de traduções extensível
- Formatação de datas, números e moedas

### ⚙️ **Recursos Avançados**
- Feature flags por módulo
- Logs de auditoria
- Sistema de backup
- Multi-campus
- Exportações CSV
- Relatórios em PDF

## 🛠️ Tecnologias

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Banco de Dados**: PostgreSQL
- **Autenticação**: NextAuth.js
- **Pagamentos**: Integração PIX
- **Comunicação**: Mailgun (Email), WhatsApp API
- **UI**: Componentes customizados com Tailwind
- **PWA**: Service Worker, Web App Manifest

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn

## 🚀 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/sua-organizacao/igreja-app.git
cd igreja-app
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/igreja_db"

# NextAuth
NEXTAUTH_SECRET="seu-secret-muito-seguro"
NEXTAUTH_URL="http://localhost:3000"

# App
APP_NAME="Sua Igreja"

# Email (Mailgun)
MAILGUN_API_KEY="sua-chave-mailgun"
MAILGUN_DOMAIN="seu-dominio.mailgun.org"

# WhatsApp (opcional)
WHATSAPP_API_KEY="sua-chave-whatsapp"
WHATSAPP_API_URL="https://api.whatsapp-provider.com"

# PIX (opcional)
PIX_PROVIDER_URL="https://api.pix-provider.com"
PIX_PROVIDER_KEY="sua-chave-pix"

# Feature Flags (opcional)
FEATURE_PIX_INTEGRATION=true
FEATURE_WHATSAPP_INTEGRATION=false
FEATURE_EMAIL_INTEGRATION=true
```

### 4. Configure o banco de dados
```bash
# Gerar o cliente Prisma
npx prisma generate

# Executar migrações
npx prisma db push

# Popular com dados de exemplo
npx prisma db seed
```

### 5. Execute o projeto
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

O sistema estará disponível em `http://localhost:3000`

## 👤 Usuários de Teste

Após executar o seed, você pode usar:

- **Admin**: `admin@igreja.com` / `admin123`
- **Pastor**: `pastor@igreja.com` / `pastor123`

## 📊 Dados de Exemplo

O seed cria automaticamente:
- 30 pessoas (incluindo admin e pastor)
- 2 famílias
- 1 grupo/célula com 10 membros
- 2 cultos com presenças registradas
- Ofertas e doações de exemplo
- 1 evento com inscrições
- Templates de comunicação

## 🚀 Deploy

### Vercel + Supabase (Recomendado)

1. **Configure o Supabase**:
   - Crie um projeto no [Supabase](https://supabase.com)
   - Obtenha a URL de conexão PostgreSQL
   - Configure as variáveis de ambiente

2. **Deploy na Vercel**:
   ```bash
   # Instale a CLI da Vercel
   npm i -g vercel
   
   # Faça o deploy
   vercel
   ```

3. **Configure as variáveis de ambiente na Vercel**:
   - Acesse o dashboard da Vercel
   - Vá em Settings > Environment Variables
   - Adicione todas as variáveis do `.env`

4. **Execute as migrações**:
   ```bash
   # Via Vercel CLI
   vercel env pull .env.local
   npx prisma db push
   npx prisma db seed
   ```

### Docker (Alternativo)

```bash
# Build da imagem
docker build -t igreja-app .

# Execute com docker-compose
docker-compose up -d
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── (protected)/       # Páginas protegidas
│   ├── api/               # API Routes
│   ├── login/             # Página de login
│   └── layout.tsx         # Layout raiz
├── components/            # Componentes React
│   ├── ui/                # Componentes base
│   ├── layout/            # Layout components
│   ├── forms/             # Formulários
│   └── tables/            # Tabelas
├── lib/                   # Configurações
│   ├── prisma.ts          # Cliente Prisma
│   └── auth.ts            # Configuração NextAuth
├── utils/                 # Utilitários
│   ├── api.ts             # Helpers de API
│   ├── csv.ts             # Exportação CSV
│   ├── pdf.ts             # Geração PDF
│   ├── pix.ts             # Integração PIX
│   ├── communication.ts   # Sistema de comunicação
│   ├── featureFlags.ts    # Feature flags
│   └── i18n.ts            # Internacionalização
├── schemas/               # Validações Zod
├── types/                 # Tipos TypeScript
└── hooks/                 # React Hooks
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start

# Linting
npm run lint

# Prisma
npm run db:generate    # Gerar cliente
npm run db:push        # Aplicar schema
npm run db:seed        # Popular dados
npm run db:studio      # Interface visual
npm run db:reset       # Resetar banco

# Testes (se configurado)
npm test
```

## 📖 Documentação da API

### Autenticação
Todas as rotas da API (exceto login) requerem autenticação via NextAuth.

### Endpoints Principais

#### Pessoas
- `GET /api/people` - Listar pessoas
- `POST /api/people` - Criar pessoa
- `GET /api/people/[id]` - Obter pessoa
- `PUT /api/people/[id]` - Atualizar pessoa
- `DELETE /api/people/[id]` - Excluir pessoa

#### Ofertas
- `GET /api/offerings` - Listar ofertas
- `POST /api/offerings` - Criar oferta
- `POST /api/offerings/pix` - Gerar pagamento PIX
- `GET /api/offerings/export` - Exportar CSV
- `GET /api/offerings/receipt/[id]` - Gerar recibo PDF

#### Grupos
- `GET /api/groups` - Listar grupos
- `POST /api/groups` - Criar grupo
- `POST /api/groups/[id]/join` - Inscrever-se
- `POST /api/groups/[id]/attendance` - Registrar presença
- `POST /api/groups/[id]/messages` - Enviar mensagem

#### Comunicação
- `GET /api/communication/templates` - Listar templates
- `POST /api/communication/templates` - Criar template
- `POST /api/communication/send` - Enviar comunicação
- `GET /api/communication/metrics` - Métricas

### Webhooks
- `POST /api/pix-webhook` - Webhook PIX
- `POST /api/communication/webhooks/mailgun` - Webhook Mailgun

## 🔒 Segurança

- Autenticação obrigatória em todas as rotas protegidas
- Sistema RBAC com 6 níveis de permissão
- Validação de dados com Zod
- Sanitização de inputs
- Rate limiting (recomendado em produção)
- HTTPS obrigatório em produção

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- 📧 Email: suporte@igreja-app.com
- 📖 Documentação: [docs.igreja-app.com](https://docs.igreja-app.com)
- 🐛 Issues: [GitHub Issues](https://github.com/sua-organizacao/igreja-app/issues)

## 🎯 Roadmap

- [ ] App mobile nativo (React Native)
- [ ] Integração com mais gateways de pagamento
- [ ] Sistema de doações recorrentes
- [ ] Módulo de voluntários
- [ ] Integração com calendário (Google Calendar)
- [ ] Sistema de check-in por geolocalização
- [ ] Relatórios avançados com BI
- [ ] API pública para integrações

---

Desenvolvido com ❤️ para a comunidade cristã.
