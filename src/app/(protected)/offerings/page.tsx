
// src/app/(protected)/offerings/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, PlusCircle, Search, Edit, Trash2, Loader2, Download } from 'lucide-react';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernInput } from '@/components/ui/ModernInput';
import { useRouter } from 'next/navigation';

interface Offering {
  id: string;
  date: string;
  origin: string;
  method: string;
  amountCents: number;
  campusName?: string;
  notes?: string;
}

export default function OfferingsPage() {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchOfferings = async (page: number, search: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/offerings?page=${page}&search=${search}`);
      const data = await response.json();
      if (response.ok) {
        setOfferings(data.offerings);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } else {
        console.error('Failed to fetch offerings:', data.error);
      }
    } catch (error) {
      console.error('Error fetching offerings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferings(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/offerings/${id}`);
  };

  const handleDownloadReceipt = (id: string) => {
    // Implement PDF receipt download logic here
    alert(`Baixar recibo para oferta ${id}`);
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/offerings/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ofertas.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        alert('Exportação CSV de ofertas iniciada!');
      } else {
        const data = await response.json();
        console.error('Failed to export offerings:', data.error);
        alert(`Erro ao exportar ofertas: ${data.error}`);
      }
    } catch (error) {
      console.error('Error exporting offerings:', error);
      alert('Erro ao exportar ofertas.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta oferta?')) {
      try {
        const response = await fetch(`/api/offerings/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchOfferings(currentPage, searchTerm); // Refresh list
        } else {
          const data = await response.json();
          console.error('Failed to delete offering:', data.error);
          alert(`Erro ao excluir oferta: ${data.error}`);
        }
      } catch (error) {
        console.error('Error deleting offering:', error);
        alert('Erro ao excluir oferta.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between space-x-3">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ofertas e Doações</h1>
              <p className="text-gray-600 mt-1">Gerencie as ofertas e doações da igreja</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <ModernButton variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </ModernButton>
            <ModernButton onClick={() => router.push('/offerings/new')}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Nova Oferta
            </ModernButton>
          </div>
        </div>

        {/* Search and Filters */}
        <ModernCard variant="outlined" className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <ModernInput
              type="text"
              placeholder="Buscar por origem ou método..."
              value={searchTerm}
              onChange={handleSearch}
              icon={<Search className="w-4 h-4 text-gray-400" />}
              className="flex-grow"
            />
            {/* Add more filters here if needed */}
          </div>
        </ModernCard>

        {/* Offerings List */}
        <ModernCard className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Carregando ofertas...</span>
            </div>
          ) : offerings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhuma oferta encontrada. Comece adicionando uma nova!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campus</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {offerings.map((offering) => (
                    <tr key={offering.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{new Date(offering.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{offering.origin}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{offering.method}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{(offering.amountCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{offering.campusName || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <ModernButton variant="ghost" size="sm" onClick={() => handleDownloadReceipt(offering.id)}>
                            <Download className="w-4 h-4" />
                          </ModernButton>
                          <ModernButton variant="ghost" size="sm" onClick={() => handleEdit(offering.id)}>
                            <Edit className="w-4 h-4" />
                          </ModernButton>
                          <ModernButton variant="destructive" size="sm" onClick={() => handleDelete(offering.id)}>
                            <Trash2 className="w-4 h-4" />
                          </ModernButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t border-gray-200">
              <ModernButton
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </ModernButton>
              <span className="text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <ModernButton
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima
              </ModernButton>
            </div>
          )}
        </ModernCard>
      </div>
    </div>
  );
}


