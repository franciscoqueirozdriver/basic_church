
'use client';

import React, { useState, useEffect } from 'react';
import { Users, PlusCircle, Search, Edit, Trash2, Loader2, MessageSquare } from 'lucide-react';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernInput } from '@/components/ui/ModernInput';
import { useRouter } from 'next/navigation';

interface Group {
  id: string;
  name: string;
  description?: string;
  leaderName?: string;
  membersCount: number;
  capacity?: number;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchGroups = async (page: number, search: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/groups?page=${page}&search=${search}`);
      const data = await response.json();
      if (response.ok) {
        setGroups(data.groups);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } else {
        console.error('Failed to fetch groups:', data.error);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups(currentPage, searchTerm);
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
    router.push(`/groups/${id}`);
  };

  const handleSendMessage = (id: string) => {
    router.push(`/groups/${id}/messages`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este grupo?')) {
      try {
        const response = await fetch(`/api/groups/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchGroups(currentPage, searchTerm); // Refresh list
        } else {
          const data = await response.json();
          console.error('Failed to delete group:', data.error);
          alert(`Erro ao excluir grupo: ${data.error}`);
        }
      } catch (error) {
        console.error('Error deleting group:', error);
        alert('Erro ao excluir grupo.');
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
              <h1 className="text-3xl font-bold text-gray-900">Grupos e Células</h1>
              <p className="text-gray-600 mt-1">Gerencie os grupos e células da igreja</p>
            </div>
          </div>
          <ModernButton onClick={() => router.push('/groups/new')}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Grupo
          </ModernButton>
        </div>

        {/* Search and Filters */}
        <ModernCard variant="outlined" className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <ModernInput
              type="text"
              placeholder="Buscar por nome ou líder..."
              value={searchTerm}
              onChange={handleSearch}
              icon={<Search className="w-4 h-4 text-gray-400" />}
              className="flex-grow"
            />
            {/* Add more filters here if needed */}
          </div>
        </ModernCard>

        {/* Groups List */}
        <ModernCard className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Carregando grupos...</span>
            </div>
          ) : groups.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhum grupo encontrado. Comece adicionando um novo!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Líder</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membros</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidade</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {groups.map((group) => (
                    <tr key={group.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{group.leaderName || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{group.membersCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{group.capacity || 'Ilimitada'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <ModernButton variant="ghost" size="sm" onClick={() => handleSendMessage(group.id)}>
                            <MessageSquare className="w-4 h-4" />
                          </ModernButton>
                          <ModernButton variant="ghost" size="sm" onClick={() => handleEdit(group.id)}>
                            <Edit className="w-4 h-4" />
                          </ModernButton>
                          <ModernButton variant="destructive" size="sm" onClick={() => handleDelete(group.id)}>
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


