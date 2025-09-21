import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Create campuses
  const mainCampus = await prisma.campus.create({
    data: {
      name: 'Campus Principal',
      address: 'Rua da Igreja, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      phone: '(11) 1234-5678',
      isActive: true
    }
  })

  const secondCampus = await prisma.campus.create({
    data: {
      name: 'Campus Norte',
      address: 'Av. Norte, 456',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '02345-678',
      phone: '(11) 2345-6789',
      isActive: true
    }
  })

  console.log('✅ Campus criados')

  // Create households
  const household1 = await prisma.household.create({
    data: {
      name: 'Família Silva',
      address: 'Rua das Flores, 789',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '03456-789'
    }
  })

  const household2 = await prisma.household.create({
    data: {
      name: 'Família Santos',
      address: 'Av. Central, 321',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04567-890'
    }
  })

  console.log('✅ Famílias criadas')

  // Create people
  const people = []
  
  // Admin user
  const adminPerson = await prisma.person.create({
    data: {
      firstName: 'Admin',
      lastName: 'Sistema',
      fullName: 'Admin Sistema',
      email: 'admin@igreja.com',
      phone: '(11) 99999-9999',
      birthDate: new Date('1980-01-01'),
      gender: 'MASCULINO',
      maritalStatus: 'CASADO',
      address: 'Rua Admin, 1',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000-000',
      joinDate: new Date('2020-01-01'),
      isActive: true,
      householdId: household1.id
    }
  })

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@igreja.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      isActive: true,
      personId: adminPerson.id
    }
  })

  people.push(adminPerson)

  // Pastor
  const pastorPerson = await prisma.person.create({
    data: {
      firstName: 'João',
      lastName: 'Pastor',
      fullName: 'João Pastor',
      email: 'pastor@igreja.com',
      phone: '(11) 98888-8888',
      birthDate: new Date('1975-05-15'),
      gender: 'MASCULINO',
      maritalStatus: 'CASADO',
      address: 'Rua Pastor, 2',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01001-001',
      joinDate: new Date('2018-01-01'),
      baptismDate: new Date('2018-02-01'),
      isActive: true,
      householdId: household1.id
    }
  })

  const pastorUser = await prisma.user.create({
    data: {
      email: 'pastor@igreja.com',
      password: await bcrypt.hash('pastor123', 10),
      role: 'PASTOR',
      isActive: true,
      personId: pastorPerson.id
    }
  })

  people.push(pastorPerson)

  // Generate 28 more people
  const firstNames = ['Maria', 'José', 'Ana', 'Carlos', 'Fernanda', 'Ricardo', 'Juliana', 'Pedro', 'Carla', 'Marcos', 'Luciana', 'Roberto', 'Patricia', 'Antonio', 'Mariana', 'Francisco', 'Camila', 'Manuel', 'Beatriz', 'João', 'Gabriela', 'Paulo', 'Renata', 'Luis', 'Daniela', 'Miguel', 'Adriana', 'Rafael']
  const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Monteiro', 'Cardoso', 'Reis', 'Araújo', 'Nascimento', 'Freitas']

  for (let i = 0; i < 28; i++) {
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[i % lastNames.length]
    const fullName = `${firstName} ${lastName}`
    
    const person = await prisma.person.create({
      data: {
        firstName,
        lastName,
        fullName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        phone: `(11) 9${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        birthDate: new Date(1970 + Math.floor(Math.random() * 40), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        gender: Math.random() > 0.5 ? 'MASCULINO' : 'FEMININO',
        maritalStatus: ['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO'][Math.floor(Math.random() * 4)] as any,
        address: `Rua ${lastName}, ${i + 10}`,
        city: 'São Paulo',
        state: 'SP',
        zipCode: `${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        baptismDate: Math.random() > 0.3 ? new Date(2021 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1) : null,
        isActive: Math.random() > 0.1,
        householdId: Math.random() > 0.5 ? household1.id : household2.id
      }
    })
    
    people.push(person)
  }

  console.log('✅ 30 pessoas criadas')

  // Create groups
  const group1 = await prisma.group.create({
    data: {
      name: 'Célula Jovens',
      description: 'Grupo de jovens e adolescentes',
      type: 'CELULA',
      meetingDay: 6, // Saturday
      meetingTime: '19:00',
      location: 'Casa da Família Silva',
      capacity: 20,
      isActive: true,
      campusId: mainCampus.id
    }
  })

  // Add members to group
  for (let i = 0; i < 10; i++) {
    await prisma.groupMember.create({
      data: {
        groupId: group1.id,
        personId: people[i + 2].id, // Skip admin and pastor
        joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      }
    })
  }

  console.log('✅ Grupo criado com membros')

  // Create services
  const service1 = await prisma.service.create({
    data: {
      name: 'Culto de Domingo Manhã',
      type: 'CULTO',
      date: new Date('2024-01-07'),
      startTime: new Date('2024-01-07T10:00:00'),
      endTime: new Date('2024-01-07T12:00:00'),
      location: 'Santuário Principal',
      capacity: 300,
      campusId: mainCampus.id
    }
  })

  const service2 = await prisma.service.create({
    data: {
      name: 'Culto de Domingo Noite',
      type: 'CULTO',
      date: new Date('2024-01-07'),
      startTime: new Date('2024-01-07T19:00:00'),
      endTime: new Date('2024-01-07T21:00:00'),
      location: 'Santuário Principal',
      capacity: 200,
      campusId: mainCampus.id
    }
  })

  console.log('✅ Serviços criados')

  // Create attendance records
  for (let i = 0; i < 15; i++) {
    await prisma.attendance.create({
      data: {
        personId: people[i].id,
        serviceId: service1.id,
        status: Math.random() > 0.2 ? 'PRESENTE' : 'AUSENTE',
        notes: Math.random() > 0.8 ? 'Primeira visita' : null
      }
    })
  }

  for (let i = 10; i < 25; i++) {
    await prisma.attendance.create({
      data: {
        personId: people[i].id,
        serviceId: service2.id,
        status: Math.random() > 0.2 ? 'PRESENTE' : 'AUSENTE'
      }
    })
  }

  console.log('✅ Presenças registradas')

  // Create offerings
  const offering1 = await prisma.offering.create({
    data: {
      date: new Date('2024-01-07'),
      origin: 'CULTO',
      method: 'DINHEIRO',
      amount: 125000, // R$ 1.250,00
      description: 'Oferta do Culto de Domingo Manhã',
      serviceId: service1.id,
      campusId: mainCampus.id,
      createdBy: adminUser.id
    }
  })

  const offering2 = await prisma.offering.create({
    data: {
      date: new Date('2024-01-07'),
      origin: 'CULTO',
      method: 'CARTAO',
      amount: 89500, // R$ 895,00
      description: 'Oferta do Culto de Domingo Noite',
      serviceId: service2.id,
      campusId: mainCampus.id,
      createdBy: adminUser.id
    }
  })

  // Create some donations
  for (let i = 0; i < 10; i++) {
    await prisma.donation.create({
      data: {
        personId: people[i + 5].id,
        offeringId: Math.random() > 0.5 ? offering1.id : offering2.id,
        amount: Math.floor(Math.random() * 10000) + 1000, // R$ 10,00 to R$ 110,00
        method: ['DINHEIRO', 'CARTAO', 'PIX'][Math.floor(Math.random() * 3)] as any,
        date: new Date('2024-01-07'),
        description: 'Doação pessoal'
      }
    })
  }

  console.log('✅ Ofertas e doações criadas')

  // Create an event
  const event1 = await prisma.event.create({
    data: {
      name: 'Conferência de Jovens 2024',
      description: 'Grande conferência para jovens com palestrantes nacionais',

      startDate: new Date('2024-03-15T19:00:00'),
      endDate: new Date('2024-03-17T21:00:00'),
      location: 'Centro de Convenções',
      capacity: 500,
      registrationRequired: true,
      registrationDeadline: new Date('2024-03-10'),
      price: 5000, // R$ 50,00
      isActive: true,
      campusId: mainCampus.id,
      createdBy: adminUser.id
    }
  })

  // Create some registrations
  for (let i = 0; i < 8; i++) {
    await prisma.eventRegistration.create({
      data: {
        eventId: event1.id,
        personId: people[i + 10].id,
        status: 'CONFIRMADO',
        registeredAt: new Date('2024-01-15'),
        notes: i === 0 ? 'Necessita transporte' : null
      }
    })
  }

  console.log('✅ Evento e inscrições criadas')

  // Create communication templates
  await prisma.communicationTemplate.create({
    data: {
      name: 'Boas-vindas - Novo Membro',
      type: 'EMAIL',
      category: 'WELCOME',
      subject: 'Bem-vindo(a) à nossa igreja!',
      content: `Olá {{nome}},

É com grande alegria que damos as boas-vindas à nossa família da fé!

Estamos muito felizes em tê-lo(a) conosco e esperamos que se sinta em casa.

Com carinho,
Equipe {{igreja}}`,
      variables: ['nome', 'igreja'],
      isActive: true,
      createdById: adminUser.id
    }
  })

  await prisma.communicationTemplate.create({
    data: {
      name: 'Lembrete de Grupo',
      type: 'WHATSAPP',
      category: 'CUSTOM',
      content: `Olá {{nome}}! 😊

Não esqueça do nosso encontro hoje às {{horario}} em {{local}}.

Nos vemos lá! 🙏`,
      variables: ['nome', 'horario', 'local'],
      isActive: true,
      createdById: adminUser.id
    }
  })

  console.log('✅ Templates de comunicação criados')

  // Create audit logs
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: 'CREATE',
      table: 'people',
      recordId: people[0].id,
      newData: { name: people[0].fullName }
    }
  })

  console.log('✅ Logs de auditoria criados')

  console.log('🎉 Seed concluído com sucesso!')
  console.log('\n📊 Dados criados:')
  console.log(`- 2 campus`)
  console.log(`- 2 famílias`)
  console.log(`- 30 pessoas`)
  console.log(`- 2 usuários (admin@igreja.com / admin123, pastor@igreja.com / pastor123)`)
  console.log(`- 1 grupo com 10 membros`)
  console.log(`- 2 cultos`)
  console.log(`- Registros de presença`)
  console.log(`- 2 ofertas com doações`)
  console.log(`- 1 evento com 8 inscrições`)
  console.log(`- 2 templates de comunicação`)
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

