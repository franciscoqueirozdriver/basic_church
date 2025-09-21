import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed simples...')

  // Limpar dados existentes
  await prisma.user.deleteMany()
  await prisma.person.deleteMany()
  await prisma.household.deleteMany()
  await prisma.campus.deleteMany()

  // Create campus
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

  // Create household
  const household1 = await prisma.household.create({
    data: {
      name: 'Família Admin',
      address: 'Rua Admin, 1',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000-000'
    }
  })

  // Create admin person
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

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@igreja.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      isActive: true,
      personId: adminPerson.id
    }
  })

  console.log('✅ Usuário admin criado: admin@igreja.com / admin123')
  console.log('🎉 Seed simples concluído!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
