import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Check if user has admin permissions
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ 
        error: 'Permissão insuficiente. Apenas administradores podem alterar configurações.' 
      }, { status: 403 });
    }

    const { logoPosition } = await request.json();

    if (!logoPosition) {
      return NextResponse.json({ error: 'Posição da logo é obrigatória' }, { status: 400 });
    }

    const validPositions = ['header-left', 'header-center', 'sidebar-top', 'sidebar-bottom'];
    if (!validPositions.includes(logoPosition)) {
      return NextResponse.json({ error: 'Posição inválida' }, { status: 400 });
    }

    // Get or create church config
    let config = await prisma.churchConfig.findFirst();
    
    if (!config) {
      config = await prisma.churchConfig.create({
        data: {
          logoPosition,
          createdBy: session.user.id,
          updatedBy: session.user.id,
        },
      });
    } else {
      config = await prisma.churchConfig.update({
        where: { id: config.id },
        data: {
          logoPosition,
          updatedBy: session.user.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      config: {
        id: config.id,
        logoPosition: config.logoPosition,
      },
    });

  } catch (error) {
    console.error('Logo position update error:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

