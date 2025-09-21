# Sistema de Gestão de Igreja - Versão Final

## 🎉 Sistema Completo e Funcional

Este é um sistema moderno de gestão de igreja desenvolvido com **Next.js 14**, **TypeScript**, **Prisma** e **PostgreSQL**. O sistema oferece uma interface moderna e intuitiva para gerenciar todos os aspectos de uma igreja.

## ✅ Funcionalidades Implementadas

### 🔐 Autenticação e Autorização
- Sistema de login seguro com NextAuth
- Controle de acesso baseado em funções (RBAC)
- 6 níveis de permissão: Admin, Pastor, Líder, Secretário, Tesoureiro, Membro

### 📊 Dashboard
- Visão geral com estatísticas em tempo real
- Total de membros: 1,247
- Presença média nos cultos
- Gráficos e métricas importantes

### 👥 Gestão de Pessoas
- Cadastro completo de membros
- Busca avançada por nome ou email
- Controle de visitantes e funcionários
- Histórico de participação

### ⛪ Cultos e Serviços
- Agendamento de cultos e eventos
- Controle de presença
- Gestão de programação semanal
- Relatórios de frequência

### 👨‍👩‍👧‍👦 Grupos e Células
- Criação e gestão de grupos
- Controle de líderes e membros
- Acompanhamento de atividades
- Comunicação interna

### 💰 Ofertas e Doações
- Registro de ofertas e dízimos
- Múltiplos métodos de pagamento
- Exportação para CSV
- Relatórios financeiros
- Integração com PIX

### 📅 Eventos
- Criação e gestão de eventos
- Controle de inscrições
- Agenda da igreja
- Notificações automáticas

### ⚙️ Configurações
- Upload de logo da igreja
- Personalização de tema baseada no logo
- Configurações gerais do sistema
- Backup e restauração

## 🎨 Design Moderno

- Interface responsiva e moderna
- Design system personalizado
- Componentes reutilizáveis
- Tema customizável baseado no logo da igreja
- Animações e transições suaves

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Banco de Dados**: PostgreSQL (produção), SQLite (desenvolvimento)
- **Autenticação**: NextAuth.js
- **Estilização**: Tailwind CSS
- **Componentes**: Sistema próprio de componentes
- **Deploy**: Vercel (recomendado)

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- PostgreSQL (para produção)

### Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd church-management

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Execute as migrações do banco
npm run db:push

# Execute o seed (dados iniciais)
npm run db:seed

# Inicie o servidor de desenvolvimento
npm run dev
```

### Credenciais Padrão
- **Email**: admin@igreja.com
- **Senha**: admin123

## 📁 Estrutura do Projeto

```
church-management/
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── (protected)/        # Rotas protegidas
│   │   │   ├── dashboard/      # Dashboard principal
│   │   │   ├── people/         # Gestão de pessoas
│   │   │   ├── services/       # Cultos e serviços
│   │   │   ├── groups/         # Grupos e células
│   │   │   ├── offerings/      # Ofertas e doações
│   │   │   ├── events/         # Eventos
│   │   │   └── settings/       # Configurações
│   │   ├── api/                # API Routes
│   │   └── login/              # Página de login
│   ├── components/             # Componentes React
│   │   ├── ui/                 # Componentes de UI
│   │   └── layout/             # Componentes de layout
│   ├── lib/                    # Utilitários e configurações
│   ├── types/                  # Definições de tipos TypeScript
│   └── utils/                  # Funções utilitárias
├── prisma/                     # Schema e migrações do banco
└── public/                     # Arquivos estáticos
```

## 🌐 Deploy no Vercel

### 1. Configurar Banco de Dados
- Crie um banco PostgreSQL (recomendado: Neon, Supabase, ou Railway)
- Obtenha a URL de conexão

### 2. Configurar Variáveis de Ambiente no Vercel
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="seu-secret-aqui"
NEXTAUTH_URL="https://seu-dominio.vercel.app"
```

### 3. Deploy
```bash
# Instale a CLI do Vercel
npm i -g vercel

# Faça o deploy
vercel --prod
```

### 4. Executar Migrações
Após o deploy, execute as migrações:
```bash
npx prisma db push
npx prisma db seed
```

## 📋 Funcionalidades Avançadas

### Sistema de Permissões
- **Admin**: Acesso total ao sistema
- **Pastor**: Gestão de membros, cultos e eventos
- **Líder**: Gestão de grupos e células
- **Secretário**: Cadastro de pessoas e eventos
- **Tesoureiro**: Gestão financeira
- **Membro**: Visualização limitada

### Integrações
- **PIX**: Pagamentos via PIX para ofertas
- **Email**: Notificações automáticas
- **CSV**: Exportação de dados
- **PDF**: Relatórios em PDF

### Recursos Técnicos
- **PWA**: Aplicativo web progressivo
- **Responsivo**: Funciona em todos os dispositivos
- **Offline**: Funcionalidades básicas offline
- **SEO**: Otimizado para motores de busca

## 🔧 Manutenção

### Backup do Banco
```bash
# Backup
pg_dump $DATABASE_URL > backup.sql

# Restauração
psql $DATABASE_URL < backup.sql
```

### Logs e Monitoramento
- Logs disponíveis no Vercel Dashboard
- Monitoramento de performance integrado
- Alertas automáticos de erro

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:
- Documentação completa no código
- Comentários detalhados em funções críticas
- Estrutura modular para fácil manutenção

## 🎯 Próximos Passos Recomendados

1. **Personalização**: Ajustar cores e logo da igreja
2. **Dados**: Importar dados existentes da igreja
3. **Treinamento**: Treinar usuários no sistema
4. **Backup**: Configurar backups automáticos
5. **Monitoramento**: Configurar alertas de sistema

---

**Sistema desenvolvido com ❤️ para facilitar a gestão da sua igreja!**
