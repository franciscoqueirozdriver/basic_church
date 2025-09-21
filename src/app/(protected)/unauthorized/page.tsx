
// src/app/(protected)/unauthorized/page.tsx

import React from 'react';
import { ShieldOff } from 'lucide-react';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <ModernCard className="p-8 text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          <ShieldOff className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Acesso Não Autorizado</h1>
        <p className="text-gray-600 mb-6">
          Você não tem permissão para acessar esta página. Por favor, entre em contato com o administrador do sistema se acreditar que isso é um erro.
        </p>
        <Link href="/dashboard" passHref>
          <ModernButton>Voltar para o Dashboard</ModernButton>
        </Link>
      </ModernCard>
    </div>
  );
}


