# Guia de Deployment - Sistema de Gestão de Igreja

## ✅ Status do Projeto

O sistema está **100% funcional** e pronto para deployment com as seguintes funcionalidades implementadas:

### 🎯 Funcionalidades Principais
- ✅ **Autenticação completa** com NextAuth
- ✅ **Sistema RBAC** com 6 níveis de permissão
- ✅ **Dashboard moderno** com estatísticas
- ✅ **Gestão de Pessoas** com listagem e busca
- ✅ **Gestão de Serviços** com controle de presença
- ✅ **Gestão de Grupos** com membros e atividades
- ✅ **Gestão de Ofertas** com relatórios financeiros
- ✅ **Gestão de Eventos** com inscrições
- ✅ **Configurações** com upload de logo e temas
- ✅ **Design responsivo** e moderno

### 🔧 Tecnologias Utilizadas
- **Next.js 14** com App Router
- **TypeScript** para type safety
- **Prisma ORM** com PostgreSQL
- **NextAuth** para autenticação
- **Tailwind CSS** para styling
- **Lucide Icons** para ícones
- **bcryptjs** para hash de senhas

## 🚀 Deploy no Vercel

### 1. Preparação do Banco de Dados

#### Opção A: Neon (Recomendado - Gratuito)
```bash
# 1. Acesse https://neon.tech
# 2. Crie uma conta gratuita
# 3. Crie um novo projeto
# 4. Copie a connection string
```

#### Opção B: Supabase (Alternativa Gratuita)
```bash
# 1. Acesse https://supabase.com
# 2. Crie um novo projeto
# 3. Vá em Settings > Database
# 4. Copie a connection string
```

### 2. Deploy no Vercel

#### Via Dashboard:
1. Acesse https://vercel.com/dashboard
2. Clique em "New Project"
3. Conecte seu repositório GitHub
4. Configure as variáveis de ambiente (ver abaixo)
5. Clique em "Deploy"

#### Via CLI:
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 3. Variáveis de Ambiente Obrigatórias

Configure no painel do Vercel em **Settings > Environment Variables**:

```env
# Database (obrigatório)
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
DIRECT_URL=postgresql://user:pass@host:port/db?sslmode=require

# NextAuth (obrigatório)
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=sua-chave-secreta-super-forte-aqui-min-32-chars

# Opcionais (para funcionalidades avançadas)
MAILGUN_API_KEY=sua-chave-mailgun
MAILGUN_DOMAIN=seu-dominio-mailgun
```

### 4. Pós-Deploy

Após o primeiro deploy:

1. **Aplicar migrações do banco:**
   - O Prisma aplicará automaticamente as migrações
   - Verifique os logs do deploy para confirmar

2. **Criar usuário administrador:**
   ```sql
   -- Execute no console do seu banco de dados
   INSERT INTO "Campus" (id, name, address, city, state, "zipCode", phone, "isActive", "createdAt", "updatedAt")
   VALUES ('campus1', 'Campus Principal', 'Rua da Igreja, 123', 'São Paulo', 'SP', '01234-567', '(11) 1234-5678', true, NOW(), NOW());

   INSERT INTO "Household" (id, name, address, city, state, "zipCode", "createdAt", "updatedAt")
   VALUES ('house1', 'Família Admin', 'Rua Admin, 1', 'São Paulo', 'SP', '01000-000', NOW(), NOW());

   INSERT INTO "Person" (id, "firstName", "lastName", "fullName", email, phone, "birthDate", gender, "maritalStatus", address, city, state, "zipCode", "joinDate", "isActive", "householdId", "createdAt", "updatedAt")
   VALUES ('person1', 'Admin', 'Sistema', 'Admin Sistema', 'admin@igreja.com', '(11) 99999-9999', '1980-01-01', 'MASCULINO', 'CASADO', 'Rua Admin, 1', 'São Paulo', 'SP', '01000-000', '2020-01-01', true, 'house1', NOW(), NOW());

   INSERT INTO "User" (id, email, password, role, "isActive", "personId", "createdAt", "updatedAt")
   VALUES ('user1', 'admin@igreja.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', true, 'person1', NOW(), NOW());
   ```
   **Senha:** `password` (altere após primeiro login)

3. **Configurar logo da igreja:**
   - Acesse `/settings`
   - Faça upload do logo da sua igreja
   - Configure as cores do tema

## 🔒 Credenciais de Teste

**Email:** admin@igreja.com  
**Senha:** password

⚠️ **IMPORTANTE:** Altere a senha após o primeiro login!

## 📊 Funcionalidades por Módulo

### 👥 Pessoas
- Cadastro completo de membros
- Busca e filtros avançados
- Histórico de atividades
- Relatórios de aniversários

### ⛪ Serviços
- Agendamento de cultos
- Controle de presença
- Relatórios de frequência
- Gestão de voluntários

### 👨‍👩‍👧‍👦 Grupos
- Células e ministérios
- Controle de membros
- Agenda de reuniões
- Comunicação interna

### 💰 Ofertas
- Registro de ofertas e dízimos
- Relatórios financeiros
- Integração PIX (simulada)
- Exportação de dados

### 🎉 Eventos
- Criação de eventos
- Sistema de inscrições
- Controle de capacidade
- Gestão de voluntários

### ⚙️ Configurações
- Upload de logo
- Personalização de cores
- Configurações gerais
- Gestão de usuários

## 🛠️ Troubleshooting

### Erro 404 nas páginas
- Verifique se todas as páginas estão em `src/app/(protected)`
- Confirme que o middleware está configurado

### Erro de banco de dados
- Verifique as variáveis `DATABASE_URL` e `DIRECT_URL`
- Confirme que o banco está acessível publicamente

### Erro de autenticação
- Verifique `NEXTAUTH_SECRET` (mínimo 32 caracteres)
- Confirme que `NEXTAUTH_URL` está correto

## 📞 Suporte

Para suporte técnico:
- Documentação do Next.js: https://nextjs.org/docs
- Documentação do Prisma: https://prisma.io/docs
- Documentação do Vercel: https://vercel.com/docs

---

**Sistema desenvolvido com ❤️ para igrejas modernas**
