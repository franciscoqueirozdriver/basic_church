
'use client';

import React, { useState, useEffect } from 'react';
import { Users, PlusCircle, Search, Edit, Trash2, Loader2, UserPlus } from 'lucide-react';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernInput } from '@/components/ui/ModernInput';
import { useRouter } from 'next/navigation';

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  householdId?: string;
  householdName?: string;
}

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchPeople = async (page: number, search: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/people?page=${page}&search=${search}`);
      const data = await response.json();
      if (response.ok) {
        setPeople(data.people);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } else {
        console.error('Failed to fetch people:', data.error);
      }
    } catch (error) {
      console.error('Error fetching people:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople(currentPage, searchTerm);
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
    router.push(`/people/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta pessoa?')) {
      try {
        const response = await fetch(`/api/people/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchPeople(currentPage, searchTerm); // Refresh list
        } else {
          const data = await response.json();
          console.error('Failed to delete person:', data.error);
          alert(`Erro ao excluir pessoa: ${data.error}`);
        }
      } catch (error) {
        console.error('Error deleting person:', error);
        alert('Erro ao excluir pessoa.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between space-x-3">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pessoas</h1>
              <p className="text-gray-600 mt-1">Gerencie membros, visitantes e funcionários da igreja</p>
            </div>
          </div>
          <ModernButton onClick={() => router.push('/people/new')}>
            <UserPlus className="w-4 h-4 mr-2" />
            Adicionar Pessoa
          </ModernButton>
        </div>

        {/* Search and Filters */}
        <ModernCard variant="outlined" className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <ModernInput
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={handleSearch}
              icon={<Search className="w-4 h-4 text-gray-400" />}
              className="flex-grow"
            />
            {/* Add more filters here if needed */}
          </div>
        </ModernCard>

        {/* People List */}
        <ModernCard className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Carregando pessoas...</span>
            </div>
          ) : people.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhuma pessoa encontrada. Comece adicionando uma nova!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Família</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {people.map((person) => (
                    <tr key={person.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{person.firstName} {person.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{person.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{person.phone || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{person.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{person.householdName || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <ModernButton variant="ghost" size="sm" onClick={() => handleEdit(person.id)}>
                            <Edit className="w-4 h-4" />
                          </ModernButton>
                          <ModernButton variant="destructive" size="sm" onClick={() => handleDelete(person.id)}>
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


