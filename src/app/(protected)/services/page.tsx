
'use client';

import React, { useState, useEffect } from 'react';
import { Church, PlusCircle, Search, Edit, Trash2, Loader2, CheckCircle } from 'lucide-react';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernInput } from '@/components/ui/ModernInput';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  name: string;
  date: string;
  campusName: string;
  attendancesCount: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchServices = async (page: number, search: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/services?page=${page}&search=${search}`);
      const data = await response.json();
      if (response.ok) {
        setServices(data.services);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } else {
        console.error('Failed to fetch services:', data.error);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(currentPage, searchTerm);
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
    router.push(`/services/${id}`);
  };

  const handleCheckin = (id: string) => {
    router.push(`/services/${id}/checkin`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este culto/serviço?')) {
      try {
        const response = await fetch(`/api/services/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchServices(currentPage, searchTerm); // Refresh list
        } else {
          const data = await response.json();
          console.error('Failed to delete service:', data.error);
          alert(`Erro ao excluir serviço: ${data.error}`);
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Erro ao excluir serviço.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between space-x-3">
          <div className="flex items-center space-x-3">
            <Church className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cultos e Serviços</h1>
              <p className="text-gray-600 mt-1">Gerencie os cultos e eventos da igreja</p>
            </div>
          </div>
          <ModernButton onClick={() => router.push('/services/new')}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Serviço
          </ModernButton>
        </div>

        {/* Search and Filters */}
        <ModernCard variant="outlined" className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <ModernInput
              type="text"
              placeholder="Buscar por nome ou data..."
              value={searchTerm}
              onChange={handleSearch}
              icon={<Search className="w-4 h-4 text-gray-400" />}
              className="flex-grow"
            />
            {/* Add more filters here if needed */}
          </div>
        </ModernCard>

        {/* Services List */}
        <ModernCard className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Carregando serviços...</span>
            </div>
          ) : services.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhum serviço encontrado. Comece adicionando um novo!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campus</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presenças</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(service.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{service.campusName || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{service.attendancesCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <ModernButton variant="ghost" size="sm" onClick={() => handleCheckin(service.id)}>
                            <CheckCircle className="w-4 h-4" />
                            Check-in
                          </ModernButton>
                          <ModernButton variant="ghost" size="sm" onClick={() => handleEdit(service.id)}>
                            <Edit className="w-4 h-4" />
                          </ModernButton>
                          <ModernButton variant="destructive" size="sm" onClick={() => handleDelete(service.id)}>
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


