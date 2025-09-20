// prisma/seed.ts
import bcrypt from 'bcryptjs'
import {
  PrismaClient,
  Gender,
  MaritalStatus,
  Role,
  PaymentMethod,
  OfferingOrigin,
  ServiceType,
} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // ========= Campi (idempotente por name, mas name NÃO é unique no schema) =========
  const ensureCampus = async (name: string, data: Omit<Parameters<typeof prisma.campus.create>[0]['data'], 'name'>) => {
    const existing = await prisma.campus.findFirst({ where: { name } })
    if (existing) return existing
    return prisma.campus.create({ data: { name, ...data } })
  }

  const mainCampus = await ensureCampus('Sede Central', {
    city: 'São Paulo',
    state: 'SP',
    isActive: true,
  })

  const zoneCampus = await ensureCampus('Zona Leste', {
    city: 'São Paulo',
    state: 'SP',
    isActive: true,
  })

  console.log('✅ Campi prontos')

  // ========= Household (idempotente por name, mas name NÃO é unique no schema) =========
  const ensureHousehold = async (name: string, data: Omit<Parameters<typeof prisma.household.create>[0]['data'], 'name'>) => {
    const existing = await prisma.household.findFirst({ where: { name } })
    if (existing) {
      // opcional: atualizar alguns campos
      return prisma.household.update({
        where: { id: existing.id },
        data,
      })
    }
    return prisma.household.create({ data: { name, ...data } })
  }

  const household = await ensureHousehold('Família Admin', {
    address: 'Rua Admin, 1',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01000-000',
    phone: '(11) 99999-9999',
    isActive: true,
  })

  console.log('✅ Household pronto')

  // ========= Pessoa (Admin) – idempotente por email (único) =========
  const adminEmail = 'admin@igreja.com'

  const adminPerson = await prisma.person.upsert({
    where: { email: adminEmail },
    update: {
      firstName: 'Admin',
      lastName: 'Sistema',
      fullName: 'Admin Sistema',
      phone: '(11) 99999-9999',
      birthDate: new Date('1980-01-01T00:00:00.000Z'),
      gender: Gender.MASCULINO,
      maritalStatus: MaritalStatus.CASADO,
      address: 'Rua Admin, 1',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000-000',
      joinDate: new Date('2020-01-01T00:00:00.000Z'),
      isActive: true,
      householdId: household.id,
    },
    create: {
      firstName: 'Admin',
      lastName: 'Sistema',
      fullName: 'Admin Sistema',
      email: adminEmail,
      phone: '(11) 99999-9999',
      birthDate: new Date('1980-01-01T00:00:00.000Z'),
      gender: Gender.MASCULINO,
      maritalStatus: MaritalStatus.CASADO,
      address: 'Rua Admin, 1',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000-000',
      joinDate: new Date('2020-01-01T00:00:00.000Z'),
      isActive: true,
      householdId: household.id,
    },
  })
  console.log('✅ Pessoa admin pronta')

  // ========= Usuário (Admin) – SEMPRE com senha BCRYPT =========
  const plain = 'admin123'
  const passwordHash = await bcrypt.hash(plain, 10)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: passwordHash, // campo do seu schema é "password"
      role: Role.ADMIN,
      personId: adminPerson.id,
      isActive: true,
    },
    create: {
      email: adminEmail,
      password: passwordHash,
      role: Role.ADMIN,
      personId: adminPerson.id,
      isActive: true,
    },
  })
  console.log('✅ Usuário admin pronto (com senha BCRYPT)')

  // ========= Serviço exemplo (hoje) =========
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0, 0)
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0, 0, 0)

  let service = await prisma.service.findFirst({
    where: {
      name: 'Culto de Domingo',
      campusId: mainCampus.id,
      date: {
        gte: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0),
        lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0, 0),
      },
    },
  })

  if (!service) {
    service = await prisma.service.create({
      data: {
        name: 'Culto de Domingo',
        description: 'Culto principal da semana',
        type: ServiceType.CULTO,
        date: start,
        startTime: start,
        endTime: end,
        location: 'Auditório Central',
        capacity: 300,
        isActive: true,
        campusId: mainCampus.id,
      },
    })
    console.log('✅ Serviço criado')
  } else {
    console.log('ℹ️ Serviço já existia para hoje')
  }

  // ========= Presença do admin no culto (idempotente por pessoa/serviço) =========
  const hasAttendance = await prisma.attendance.findFirst({
    where: { personId: adminPerson.id, serviceId: service.id },
  })
  if (!hasAttendance) {
    await prisma.attendance.create({
      data: { personId: adminPerson.id, serviceId: service.id },
    })
    console.log('✅ Presença criada')
  } else {
    console.log('ℹ️ Presença já existia')
  }

  // ========= Oferta e Doação (evita duplicar) =========
  let offering = await prisma.offering.findFirst({
    where: {
      serviceId: service.id,
      campusId: mainCampus.id,
      amount: 5000,
      origin: OfferingOrigin.CULTO,
      method: PaymentMethod.PIX,
    },
  })

  if (!offering) {
    offering = await prisma.offering.create({
      data: {
        date: new Date(),
        origin: OfferingOrigin.CULTO,
        method: PaymentMethod.PIX,
        amount: 5000, // R$ 50,00 em centavos
        description: 'Oferta de abertura',
        campusId: mainCampus.id,
        serviceId: service.id,
      },
    })
    console.log('✅ Oferta criada')
  } else {
    console.log('ℹ️ Oferta já existia')
  }

  const hasDonation = await prisma.donation.findFirst({
    where: {
      personId: adminPerson.id,
      offeringId: offering.id,
      amount: 5000,
      method: PaymentMethod.PIX,
    },
  })

  if (!hasDonation) {
    await prisma.donation.create({
      data: {
        personId: adminPerson.id,
        offeringId: offering.id,
        amount: 5000,
        method: PaymentMethod.PIX,
        date: new Date(),
        description: 'Doação admin',
      },
    })
    console.log('✅ Doação criada')
  } else {
    console.log('ℹ️ Doação já existia')
  }

  // ========= Config da igreja (idempotente pela PK) =========
  await prisma.churchConfig.upsert({
    where: { id: 'default-church-config' },
    update: {
      churchName: 'Igreja Exemplo',
      description: 'Configuração inicial',
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR',
      currency: 'BRL',
    },
    create: {
      id: 'default-church-config',
      churchName: 'Igreja Exemplo',
      description: 'Configuração inicial',
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR',
      currency: 'BRL',
    },
  })
  console.log('✅ ChurchConfig pronta')

  console.log('\n🎉 Seed finalizado com sucesso!')
  console.log('   Login de teste ->', adminEmail, '/', plain, '\n')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
