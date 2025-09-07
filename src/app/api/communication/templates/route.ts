import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, getPaginationParams, createPaginatedResponse, validateBody, handleApiError } from '@/utils/api'
import { z } from 'zod'

const templateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(['EMAIL', 'WHATSAPP', 'BOTH']),
  category: z.enum(['WELCOME', 'POST_SERVICE', 'MISSED_YOU', 'SCHEDULE_CONFIRMATION', 'CUSTOM']),
  subject: z.string().optional(),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  variables: z.array(z.string()).optional(),
  isActive: z.boolean().default(true)
})

// GET /api/communication/templates - List templates
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const pagination = getPaginationParams(request)
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const isActive = searchParams.get('isActive')

    // Build where clause
    const where: any = {}
    
    if (category) where.category = category
    if (type) where.type = type
    if (isActive !== null) where.isActive = isActive === 'true'

    // Get templates
    const [total, templates] = await Promise.all([
      prisma.communicationTemplate.count({ where }),
      prisma.communicationTemplate.findMany({
        where,
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              person: {
                select: {
                  fullName: true
                }
              }
            }
          },
          _count: {
            select: {
              communications: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: pagination.skip,
        take: pagination.limit
      })
    ])

    const response = createPaginatedResponse(templates, total, pagination)
    
    return NextResponse.json(response)
  } catch (error) {
    return handleApiError(error)
  }
}, ['communication:read'])

// POST /api/communication/templates - Create template
export const POST = withAuth(async (request: NextRequest, user: any) => {
  try {
    const body = await request.json()
    const data = validateBody(templateSchema, body)

    const template = await prisma.communicationTemplate.create({
      data: {
        ...data,
        createdById: user.id
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            person: {
              select: {
                fullName: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}, ['communication:write'])

// Default templates to seed
export const defaultTemplates = [
  {
    name: 'Boas-vindas - Novo Membro',
    type: 'EMAIL',
    category: 'WELCOME',
    subject: 'Bem-vindo(a) à nossa igreja!',
    content: `Olá {{nome}},

É com grande alegria que damos as boas-vindas à nossa família da fé!

Estamos muito felizes em tê-lo(a) conosco e esperamos que se sinta em casa. Nossa igreja é um lugar onde você pode crescer espiritualmente, fazer novos amigos e servir a Deus com alegria.

Algumas informações importantes:
- Cultos: Domingos às 10h e 19h
- Escola Bíblica: Domingos às 9h
- Grupos de Célula: Consulte nossa programação

Se tiver alguma dúvida ou precisar de ajuda, não hesite em nos procurar.

Que Deus abençoe sua caminhada conosco!

Com carinho,
Equipe {{igreja}}`,
    variables: ['nome', 'igreja']
  },
  {
    name: 'Pós-Culto - Agradecimento',
    type: 'BOTH',
    category: 'POST_SERVICE',
    subject: 'Obrigado por estar conosco hoje!',
    content: `Olá {{nome}},

Que alegria ter você conosco no culto de hoje! Esperamos que a mensagem tenha tocado seu coração.

{{#se_primeira_visita}}
Se esta foi sua primeira visita, gostaríamos de conhecê-lo(a) melhor. Entre em contato conosco!
{{/se_primeira_visita}}

Próximos eventos:
{{#eventos}}
- {{nome_evento}} - {{data_evento}}
{{/eventos}}

Continue firme na fé!

Equipe {{igreja}}`,
    variables: ['nome', 'igreja', 'se_primeira_visita', 'eventos']
  },
  {
    name: 'Sentimos sua Falta',
    type: 'WHATSAPP',
    category: 'MISSED_YOU',
    content: `Olá {{nome}}! 😊

Notamos que você não tem vindo aos nossos encontros ultimamente e queremos que saiba que sentimos sua falta!

Nossa comunidade não é a mesma sem você. Se estiver passando por alguma dificuldade ou precisar de oração, estamos aqui para apoiá-lo(a).

Próximo culto: {{proximo_culto}}
Local: {{endereco}}

Esperamos vê-lo(a) em breve! 🙏

Com carinho,
{{igreja}}`,
    variables: ['nome', 'proximo_culto', 'endereco', 'igreja']
  },
  {
    name: 'Confirmação de Escala',
    type: 'EMAIL',
    category: 'SCHEDULE_CONFIRMATION',
    subject: 'Confirmação de Escala - {{data_servico}}',
    content: `Olá {{nome}},

Você está escalado(a) para servir em:

Data: {{data_servico}}
Horário: {{horario_servico}}
Função: {{funcao}}
Local: {{local}}

{{#observacoes}}
Observações importantes:
{{observacoes}}
{{/observacoes}}

Por favor, confirme sua presença respondendo este e-mail ou pelo WhatsApp.

Se não puder comparecer, avise com antecedência para que possamos encontrar um substituto.

Obrigado por seu serviço!

Coordenação de {{ministerio}}`,
    variables: ['nome', 'data_servico', 'horario_servico', 'funcao', 'local', 'observacoes', 'ministerio']
  }
]

