import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { imageUploadService } from '@/utils/imageUpload';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Check if user has admin permissions
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ 
        error: 'Permissão insuficiente. Apenas administradores podem alterar a logo.' 
      }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('logo') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    // Validate file
    const validation = imageUploadService.validateImageFile({
      mimetype: file.type,
      size: file.size,
    });

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Process and save image
    const uploadResult = await imageUploadService.processAndSaveImage(
      buffer,
      'church-logo',
      {
        maxWidth: 300,
        maxHeight: 120,
        quality: 90,
        format: 'png',
        preserveAspectRatio: true,
      }
    );

    if (!uploadResult.success) {
      return NextResponse.json({ 
        error: uploadResult.error || 'Erro ao processar imagem' 
      }, { status: 500 });
    }

    // Extract dominant colors for future use
    const dominantColors = await imageUploadService.extractDominantColors(buffer);

    // Get or create church config
    let config = await prisma.churchConfig.findFirst();
    
    if (!config) {
      config = await prisma.churchConfig.create({
        data: {
          logoUrl: uploadResult.url,
          logoWidth: uploadResult.width,
          logoHeight: uploadResult.height,
          logoColorAnalysis: {
            dominantColors,
            extractedAt: new Date().toISOString(),
          },
          createdBy: session.user.id,
          updatedBy: session.user.id,
        },
      });
    } else {
      config = await prisma.churchConfig.update({
        where: { id: config.id },
        data: {
          logoUrl: uploadResult.url,
          logoWidth: uploadResult.width,
          logoHeight: uploadResult.height,
          logoColorAnalysis: {
            dominantColors,
            extractedAt: new Date().toISOString(),
          },
          updatedBy: session.user.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      config: {
        id: config.id,
        logoUrl: config.logoUrl,
        logoWidth: config.logoWidth,
        logoHeight: config.logoHeight,
      },
      uploadResult,
      dominantColors,
    });

  } catch (error) {
    console.error('Logo upload error:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const config = await prisma.churchConfig.findFirst({
      select: {
        id: true,
        logoUrl: true,
        logoWidth: true,
        logoHeight: true,
        logoPosition: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        colorPaletteSource: true,
      },
    });

    return NextResponse.json({
      config: config || {
        logoUrl: null,
        logoWidth: 120,
        logoHeight: 40,
        logoPosition: 'header-left',
        primaryColor: '#3b82f6',
        secondaryColor: '#a855f7',
        accentColor: '#22c55e',
        colorPaletteSource: 'default',
      },
    });

  } catch (error) {
    console.error('Config fetch error:', error);
    return NextResponse.json({ 
      error: 'Erro ao buscar configurações' 
    }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ 
        error: 'Permissão insuficiente' 
      }, { status: 403 });
    }

    const config = await prisma.churchConfig.findFirst();
    
    if (!config) {
      return NextResponse.json({ error: 'Configuração não encontrada' }, { status: 404 });
    }

    // Update config to remove logo
    await prisma.churchConfig.update({
      where: { id: config.id },
      data: {
        logoUrl: null,
        logoWidth: 120,
        logoHeight: 40,
        logoColorAnalysis: null,
        colorPaletteSource: 'default',
        updatedBy: session.user.id,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Logo delete error:', error);
    return NextResponse.json({ 
      error: 'Erro ao remover logo' 
    }, { status: 500 });
  }
}

