# 🏛️ Igreja App - Sistema de Gestão de Igreja

Um sistema completo e moderno para gestão de igrejas, desenvolvido com Next.js 14, Prisma, NextAuth.js e um design system contemporâneo.

## ✨ Características Principais

### 🎨 **Design Moderno**
- **Design System Completo**: Componentes modernos e consistentes
- **Interface Responsiva**: Otimizada para desktop, tablet e mobile
- **Animações Suaves**: Micro-interações e transições elegantes
- **Paleta de Cores Moderna**: Gradientes e efeitos visuais contemporâneos

### 🔐 **Sistema de Autenticação Robusto**
- **NextAuth.js**: Autenticação segura e confiável
- **RBAC Completo**: 6 níveis de permissão (Admin, Pastor, Tesouraria, Coord. Grupos, Recepção, Membro)
- **Middleware de Proteção**: Rotas protegidas por role
- **Sessões Persistentes**: Login mantido entre sessões

### 👥 **Gestão de Pessoas**
- **CRUD Completo**: Cadastro, edição, visualização e exclusão
- **Famílias**: Agrupamento de membros por família
- **Fotos**: Upload e gerenciamento de fotos dos membros
- **Filtros Avançados**: Busca por nome, idade, status, etc.
- **Exportação**: Relatórios em CSV e PDF

### 📅 **Controle de Presença**
- **Check-in Rápido**: Sistema ágil para registro de presença
- **Busca por Nome**: Localização rápida de membros
- **QR Code**: Check-in via código QR (planejado)
- **Relatórios**: Estatísticas de presença por período
- **Dashboard**: Métricas visuais de frequência

### 💰 **Sistema de Ofertas Avançado**
- **Múltiplas Origens**: Culto, célula, campanha, eventos
- **Métodos de Pagamento**: Dinheiro, cartão, PIX
- **Integração PIX**: QR Code e copia-e-cola automáticos
- **Reconciliação**: Webhook para confirmação automática
- **Recibos PDF**: Geração automática de comprovantes
- **Relatórios Anuais**: Relatório por pessoa para IR
- **Dashboard Financeiro**: Métricas e gráficos em tempo real

### 👨‍👩‍👧‍👦 **Gestão de Grupos/Células**
- **CRUD de Grupos**: Criação e gerenciamento completo
- **Inscrição Self-Service**: Membros podem se inscrever
- **Controle de Capacidade**: Limite de participantes
- **Sistema de Presença**: Registro por encontro
- **Lembretes Automáticos**: Notificações no dia do grupo
- **Alertas**: Aviso para 3 faltas consecutivas
- **Comunicação**: Envio de mensagens para membros

### 📧 **Sistema de Comunicação**
- **Templates Personalizáveis**: Boas-vindas, pós-culto, etc.
- **Segmentação**: Envios por grupo, tag ou critério
- **Múltiplos Canais**: Email (Mailgun) e WhatsApp
- **Métricas**: Enviados, falhas, aberturas
- **Webhooks**: Integração com provedores externos

### 📊 **Relatórios e Analytics**
- **Dashboard Executivo**: Métricas principais em tempo real
- **Relatórios Customizáveis**: Filtros por período, grupo, etc.
- **Exportações**: CSV, PDF, Excel
- **Gráficos Interativos**: Visualizações modernas
- **KPIs**: Indicadores de crescimento e engajamento

### 📱 **PWA (Progressive Web App)**
- **Instalável**: Funciona como app nativo
- **Offline**: Funcionalidades básicas sem internet
- **Push Notifications**: Notificações em tempo real
- **Service Worker**: Cache inteligente

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **Next.js 14**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Framework CSS utilitário
- **Lucide React**: Ícones modernos
- **Design System**: Componentes customizados

### **Backend**
- **Next.js API Routes**: APIs RESTful
- **Prisma ORM**: Mapeamento objeto-relacional
- **PostgreSQL**: Banco de dados principal
- **Zod**: Validação de schemas

### **Autenticação**
- **NextAuth.js**: Sistema de autenticação
- **JWT**: Tokens seguros
- **Bcrypt**: Hash de senhas

### **Integrações**
- **Mailgun**: Envio de emails
- **PIX**: Pagamentos instantâneos
- **WhatsApp Business**: Mensagens (webhook)

### **DevOps**
- **Vercel**: Deploy e hosting
- **Supabase**: Banco PostgreSQL gerenciado
- **GitHub**: Controle de versão

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+ 
- PostgreSQL 14+
- Git

### **1. Clone o Repositório**
```bash
git clone https://github.com/fjaqueiroz/church.ai.git
cd church.ai
```

### **2. Instale as Dependências**
```bash
npm install
```

### **3. Configure as Variáveis de Ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/igreja_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-super-seguro-aqui"

# Email (Mailgun)
MAILGUN_API_KEY="key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
MAILGUN_DOMAIN="mg.seudominio.com"

# PIX (Opcional)
PIX_PROVIDER_URL="https://api.provedor-pix.com"
PIX_API_KEY="sua-chave-pix"

# WhatsApp (Opcional)
WHATSAPP_API_URL="https://api.whatsapp-provider.com"
WHATSAPP_TOKEN="seu-token-whatsapp"

# Feature Flags
FEATURE_PIX_ENABLED="true"
FEATURE_WHATSAPP_ENABLED="true"
FEATURE_REPORTS_ENABLED="true"
```

### **4. Configure o Banco de Dados**
```bash
# Gerar cliente Prisma
npm run db:generate

# Executar migrations
npm run db:push

# Popular com dados de exemplo
npm run db:seed
```

### **5. Execute em Desenvolvimento**
```bash
npm run dev
```

Acesse: http://localhost:3000

### **6. Build para Produção**
```bash
npm run build
npm start
```

## 👤 Usuários de Teste

Após executar o seed, você terá os seguintes usuários:

| Email | Senha | Role | Descrição |
|-------|-------|------|-----------|
| admin@igreja.com | admin123 | ADMIN | Acesso total ao sistema |
| pastor@igreja.com | pastor123 | PASTOR | Acesso pastoral completo |
| tesouraria@igreja.com | tesouraria123 | TESOURARIA | Gestão financeira |
| coordenador@igreja.com | coord123 | COORD_GRUPOS | Coordenação de grupos |
| recepcao@igreja.com | recepcao123 | RECEPCAO | Recepção e cadastros |
| membro@igreja.com | membro123 | MEMBRO | Acesso básico |

## 🎨 Design System

O sistema inclui um design system completo com:

### **Componentes Modernos**
- **ModernButton**: Botões com gradientes e animações
- **ModernInput**: Campos com labels flutuantes
- **ModernCard**: Cards com múltiplas variantes
- **StatCard**: Cartões de métricas visuais
- **ModernSidebar**: Navegação colapsável
- **ModernHeader**: Cabeçalho com notificações

### **Paleta de Cores**
- **Primary**: Azul moderno (#3b82f6)
- **Secondary**: Roxo elegante (#a855f7)
- **Success**: Verde vibrante (#22c55e)
- **Warning**: Âmbar sofisticado (#f59e0b)
- **Error**: Vermelho refinado (#ef4444)

### **Demonstração**
Acesse `/demo-modern` para ver todos os componentes em ação.

Documentação completa: [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

## 📋 Funcionalidades por Módulo

### **Dashboard**
- ✅ Métricas principais (membros, presença, ofertas, grupos)
- ✅ Atividades recentes
- ✅ Próximos eventos
- ✅ Ações rápidas
- ✅ Gráficos e indicadores visuais

### **Pessoas**
- ✅ CRUD completo de membros
- ✅ Gestão de famílias
- ✅ Upload de fotos
- ✅ Filtros e busca avançada
- ✅ Exportação de relatórios
- ✅ Histórico de atividades

### **Serviços/Cultos**
- ✅ Cadastro de serviços
- ✅ Check-in rápido de presença
- ✅ Busca por nome
- ✅ Relatórios de frequência
- ✅ Estatísticas por período
- 🔄 QR Code para check-in

### **Ofertas**
- ✅ Registro por origem (culto, célula, campanha)
- ✅ Múltiplos métodos de pagamento
- ✅ Integração PIX completa
- ✅ Reconciliação automática
- ✅ Geração de recibos PDF
- ✅ Relatórios anuais
- ✅ Dashboard financeiro
- ✅ Exportação CSV

### **Grupos/Células**
- ✅ CRUD de grupos
- ✅ Inscrição self-service
- ✅ Controle de capacidade
- ✅ Sistema de presença
- ✅ Lembretes automáticos
- ✅ Comunicação com membros
- ✅ Relatórios de participação

### **Eventos**
- ✅ Criação e gestão de eventos
- ✅ Sistema de inscrições
- ✅ Controle de capacidade
- ✅ Cobrança opcional
- ✅ Lista de participantes
- ✅ Check-in no evento

### **Comunicação**
- ✅ Templates personalizáveis
- ✅ Segmentação por grupos/tags
- ✅ Envio via email (Mailgun)
- ✅ WhatsApp (webhook stub)
- ✅ Métricas de entrega
- ✅ Histórico de envios

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build           # Build para produção
npm start              # Servidor de produção

# Banco de Dados
npm run db:generate     # Gerar cliente Prisma
npm run db:push        # Aplicar schema ao banco
npm run db:seed        # Popular com dados de teste
npm run db:studio      # Interface visual do Prisma

# Qualidade de Código
npm run lint           # Verificar ESLint
npm run lint:fix       # Corrigir problemas do ESLint
npm run type-check     # Verificar tipos TypeScript

# Utilitários
npm run clean          # Limpar cache e builds
npm run reset          # Reset completo do projeto
```

## 🚀 Deploy

### **Vercel + Supabase (Recomendado)**

1. **Configure o Supabase**
   - Crie um projeto em [supabase.com](https://supabase.com)
   - Obtenha a URL de conexão PostgreSQL
   - Configure as variáveis de ambiente

2. **Deploy no Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Configure as Variáveis de Ambiente**
   - Acesse o dashboard do Vercel
   - Configure todas as variáveis do `.env.example`
   - Execute as migrations em produção

4. **Execute as Migrations**
   ```bash
   # No ambiente de produção
   npx prisma db push
   npx prisma db seed
   ```

### **Docker (Alternativo)**

```bash
# Build da imagem
docker build -t igreja-app .

# Execute com docker-compose
docker-compose up -d
```

### **VPS/Servidor Próprio**

1. **Instale as dependências**
   ```bash
   # Node.js, PostgreSQL, PM2
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs postgresql
   npm install -g pm2
   ```

2. **Configure o banco**
   ```bash
   sudo -u postgres createdb igreja_db
   sudo -u postgres createuser igreja_user
   ```

3. **Deploy da aplicação**
   ```bash
   git clone https://github.com/fjaqueiroz/church.ai.git
   cd church.ai
   npm install
   npm run build
   pm2 start npm --name "igreja-app" -- start
   ```

## 📊 Estrutura do Banco de Dados

### **Principais Tabelas**
- **User**: Usuários do sistema
- **Person**: Pessoas/membros da igreja
- **Household**: Famílias
- **Service**: Cultos e serviços
- **Attendance**: Presenças
- **Group**: Grupos e células
- **GroupAttendance**: Presença em grupos
- **Offering**: Ofertas e doações
- **DonationOnline**: Doações online (PIX)
- **Event**: Eventos da igreja
- **Registration**: Inscrições em eventos
- **CommunicationTemplate**: Templates de comunicação
- **CommunicationLog**: Log de envios

### **Relacionamentos**
- Pessoa ↔ Família (N:1)
- Pessoa ↔ Presença (1:N)
- Grupo ↔ Membros (N:N)
- Evento ↔ Inscrições (1:N)
- Usuário ↔ Pessoa (1:1)

## 🔒 Segurança

### **Autenticação**
- Senhas hasheadas com bcrypt
- JWT tokens seguros
- Sessões com expiração
- Middleware de proteção

### **Autorização**
- RBAC com 6 níveis
- Permissões granulares
- Validação em todas as rotas
- Logs de auditoria

### **Dados**
- Validação com Zod
- Sanitização de inputs
- Proteção contra SQL injection
- Rate limiting (planejado)

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes de integração
npm run test:integration

# Coverage
npm run test:coverage

# E2E (Playwright)
npm run test:e2e
```

## 📈 Monitoramento

### **Logs**
- Logs estruturados
- Níveis de log configuráveis
- Rotação automática
- Integração com Sentry (planejado)

### **Métricas**
- Performance de APIs
- Uso de recursos
- Erros e exceções
- Analytics de usuário

## 🤝 Contribuição

1. **Fork o projeto**
2. **Crie uma branch** (`git checkout -b feature/nova-funcionalidade`)
3. **Commit suas mudanças** (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push para a branch** (`git push origin feature/nova-funcionalidade`)
5. **Abra um Pull Request**

### **Padrões de Código**
- ESLint + Prettier configurados
- Conventional Commits
- TypeScript strict mode
- Testes obrigatórios para novas features

## 📝 Roadmap

### **v2.0 - Próximas Funcionalidades**
- [ ] **Tema Escuro**: Suporte completo ao dark mode
- [ ] **App Mobile**: React Native ou PWA avançado
- [ ] **Integração Contábil**: Exportação para sistemas contábeis
- [ ] **BI Avançado**: Dashboard executivo com mais métricas
- [ ] **Multi-igreja**: Suporte a múltiplas igrejas
- [ ] **API Pública**: Endpoints para integrações externas

### **v2.1 - Melhorias**
- [ ] **Notificações Push**: Sistema completo de notificações
- [ ] **Chat Interno**: Comunicação entre líderes
- [ ] **Agenda Compartilhada**: Calendário de eventos
- [ ] **Biblioteca de Mídia**: Gestão de fotos e vídeos
- [ ] **Sistema de Voluntários**: Escalas e ministérios

## 📞 Suporte

### **Documentação**
- [Design System](./DESIGN_SYSTEM.md)
- [API Reference](./docs/API.md)
- [Deployment Guide](./docs/DEPLOY.md)

### **Comunidade**
- **GitHub Issues**: Bugs e feature requests
- **Discussions**: Dúvidas e discussões
- **Discord**: Chat da comunidade (em breve)

### **Contato**
- **Email**: suporte@igreja-app.com
- **Website**: https://igreja-app.com
- **GitHub**: https://github.com/fjaqueiroz/church.ai

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- **Comunidade Next.js**: Framework incrível
- **Prisma Team**: ORM excepcional
- **Tailwind CSS**: Framework CSS produtivo
- **Vercel**: Platform de deploy fantástica
- **Comunidade Open Source**: Inspiração e colaboração

---

**Desenvolvido com ❤️ para a comunidade cristã**

*"E tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor, e não aos homens." - Colossenses 3:23*

