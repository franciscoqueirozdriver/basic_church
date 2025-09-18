# Design System - Igreja App

## Visão Geral

O Design System do Igreja App foi criado para proporcionar uma experiência moderna, consistente e acessível em todo o sistema de gestão da igreja. Baseado em princípios de design contemporâneos, oferece componentes reutilizáveis e tokens de design padronizados.

## Princípios de Design

### 1. **Clareza e Simplicidade**
- Interface limpa e intuitiva
- Hierarquia visual clara
- Redução de ruído visual

### 2. **Consistência**
- Padrões visuais uniformes
- Comportamentos previsíveis
- Linguagem visual coesa

### 3. **Acessibilidade**
- Contraste adequado para legibilidade
- Suporte a tecnologias assistivas
- Navegação por teclado

### 4. **Modernidade**
- Tendências atuais de UI/UX
- Animações e micro-interações
- Design responsivo

## Paleta de Cores

### Cores Primárias

#### Primary (Azul)
- **50**: #eff6ff - Fundo muito claro
- **100**: #dbeafe - Fundo claro
- **200**: #bfdbfe - Bordas claras
- **300**: #93c5fd - Elementos secundários
- **400**: #60a5fa - Hover states
- **500**: #3b82f6 - **Cor principal**
- **600**: #2563eb - Elementos ativos
- **700**: #1d4ed8 - Texto em fundos claros
- **800**: #1e40af - Elementos de destaque
- **900**: #1e3a8a - Texto principal

#### Secondary (Roxo)
- **50**: #faf5ff
- **100**: #f3e8ff
- **200**: #e9d5ff
- **300**: #d8b4fe
- **400**: #c084fc
- **500**: #a855f7 - **Cor secundária**
- **600**: #9333ea
- **700**: #7c3aed
- **800**: #6b21a8
- **900**: #581c87

### Cores de Estado

#### Success (Verde)
- **500**: #22c55e - Sucesso, confirmações
- **600**: #16a34a - Hover de sucesso
- **700**: #15803d - Texto de sucesso

#### Warning (Âmbar)
- **500**: #f59e0b - Avisos, atenção
- **600**: #d97706 - Hover de aviso
- **700**: #b45309 - Texto de aviso

#### Error (Vermelho)
- **500**: #ef4444 - Erros, ações destrutivas
- **600**: #dc2626 - Hover de erro
- **700**: #b91c1c - Texto de erro

### Cores Neutras

#### Neutral (Cinzas)
- **50**: #fafafa - Fundo da aplicação
- **100**: #f5f5f5 - Fundos de seção
- **200**: #e5e5e5 - Bordas
- **300**: #d4d4d4 - Bordas ativas
- **400**: #a3a3a3 - Texto desabilitado
- **500**: #737373 - Texto secundário
- **600**: #525252 - Texto principal
- **700**: #404040 - Títulos
- **800**: #262626 - Texto de destaque
- **900**: #171717 - Texto principal escuro

## Tipografia

### Família de Fontes
- **Principal**: Inter (Google Fonts)
- **Monospace**: JetBrains Mono

### Escala Tipográfica

#### Tamanhos
- **xs**: 12px (0.75rem) - Legendas, metadados
- **sm**: 14px (0.875rem) - Texto secundário
- **base**: 16px (1rem) - Texto principal
- **lg**: 18px (1.125rem) - Texto destacado
- **xl**: 20px (1.25rem) - Subtítulos
- **2xl**: 24px (1.5rem) - Títulos de seção
- **3xl**: 30px (1.875rem) - Títulos de página
- **4xl**: 36px (2.25rem) - Títulos principais
- **5xl**: 48px (3rem) - Títulos de destaque
- **6xl**: 60px (3.75rem) - Títulos hero

#### Pesos
- **Light**: 300 - Texto decorativo
- **Normal**: 400 - Texto padrão
- **Medium**: 500 - Texto de destaque
- **Semibold**: 600 - Subtítulos
- **Bold**: 700 - Títulos
- **Extrabold**: 800 - Títulos principais

## Espaçamento

### Sistema de Espaçamento (baseado em 4px)
- **0**: 0px
- **1**: 4px (0.25rem)
- **2**: 8px (0.5rem)
- **3**: 12px (0.75rem)
- **4**: 16px (1rem) - **Unidade base**
- **5**: 20px (1.25rem)
- **6**: 24px (1.5rem)
- **8**: 32px (2rem)
- **10**: 40px (2.5rem)
- **12**: 48px (3rem)
- **16**: 64px (4rem)
- **20**: 80px (5rem)
- **24**: 96px (6rem)

### Aplicação
- **Padding interno**: 4, 6, 8px
- **Margens entre elementos**: 4, 8, 12px
- **Espaçamento de seções**: 16, 24, 32px
- **Layout principal**: 48, 64, 96px

## Bordas e Raios

### Border Radius
- **sm**: 2px (0.125rem) - Elementos pequenos
- **default**: 4px (0.25rem) - Padrão
- **md**: 6px (0.375rem) - Inputs
- **lg**: 8px (0.5rem) - Cards pequenos
- **xl**: 12px (0.75rem) - **Cards principais**
- **2xl**: 16px (1rem) - Cards grandes
- **3xl**: 24px (1.5rem) - Elementos especiais
- **full**: 9999px - Elementos circulares

## Sombras

### Níveis de Elevação
- **sm**: Elementos sutis
- **default**: Cards padrão
- **md**: Cards elevados
- **lg**: **Modais, dropdowns**
- **xl**: Elementos flutuantes
- **2xl**: Elementos de destaque máximo

### Implementação
```css
/* Sombra padrão */
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

/* Sombra elevada */
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

## Animações e Transições

### Durações
- **75ms**: Micro-interações
- **150ms**: **Padrão** - Hover, focus
- **200ms**: Transições de estado
- **300ms**: Animações de entrada/saída
- **500ms**: Animações complexas

### Easing
- **linear**: Animações constantes
- **ease-in**: Aceleração gradual
- **ease-out**: **Padrão** - Desaceleração gradual
- **ease-in-out**: Aceleração e desaceleração

### Implementação
```css
transition: all 200ms ease-out;
```

## Componentes

### Hierarquia de Componentes
1. **Tokens** - Valores base (cores, espaçamentos)
2. **Elementos** - Componentes básicos (Button, Input)
3. **Padrões** - Combinações de elementos (Card, Form)
4. **Layouts** - Estruturas de página (Sidebar, Header)

### Nomenclatura
- **Modern[Component]** - Versão modernizada
- **[Component]Props** - Interface de propriedades
- **[variant]** - Variações do componente

## Responsividade

### Breakpoints
- **sm**: 640px - Tablets pequenos
- **md**: 768px - Tablets
- **lg**: 1024px - **Desktop pequeno**
- **xl**: 1280px - Desktop
- **2xl**: 1536px - Desktop grande

### Estratégia
- **Mobile-first**: Design iniciado para mobile
- **Progressive enhancement**: Melhorias para telas maiores
- **Touch-friendly**: Elementos adequados para toque

## Acessibilidade

### Contraste
- **Texto normal**: Mínimo 4.5:1
- **Texto grande**: Mínimo 3:1
- **Elementos gráficos**: Mínimo 3:1

### Navegação
- **Focus visible**: Indicadores claros de foco
- **Keyboard navigation**: Suporte completo ao teclado
- **Screen readers**: Semântica adequada

### Implementação
```css
:focus-visible {
  outline: none;
  ring: 2px solid rgb(59 130 246);
  ring-offset: 2px;
}
```

## Uso dos Componentes

### Importação
```tsx
import { ModernButton } from '@/components/ui/ModernButton'
import { ModernInput } from '@/components/ui/ModernInput'
import { ModernCard } from '@/components/ui/ModernCard'
```

### Exemplo de Uso
```tsx
<ModernCard variant="elevated" hover>
  <ModernCardHeader>
    <ModernCardTitle>Título do Card</ModernCardTitle>
  </ModernCardHeader>
  <ModernCardContent>
    <ModernInput
      label="Email"
      type="email"
      leftIcon={<Mail className="w-5 h-5" />}
      variant="filled"
    />
    <ModernButton
      variant="primary"
      size="lg"
      rightIcon={<ArrowRight className="w-5 h-5" />}
    >
      Enviar
    </ModernButton>
  </ModernCardContent>
</ModernCard>
```

## Melhores Práticas

### Do's ✅
- Use os tokens de design definidos
- Mantenha consistência visual
- Teste em diferentes dispositivos
- Considere acessibilidade
- Use animações sutis

### Don'ts ❌
- Não crie cores personalizadas
- Não ignore responsividade
- Não abuse de animações
- Não comprometa acessibilidade
- Não misture padrões visuais

## Evolução do Design System

### Versionamento
- **v1.0**: Versão inicial com componentes básicos
- **v1.1**: Componentes modernos implementados
- **v2.0**: Planejado - Tema escuro e mais variações

### Contribuição
1. Documente novos componentes
2. Mantenha consistência com tokens existentes
3. Teste acessibilidade
4. Atualize esta documentação

---

*Este design system é um documento vivo e deve ser atualizado conforme a evolução da aplicação.*

