
// src/app/(protected)/events/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { CalendarDays, PlusCircle, Search, Edit, Trash2, Loader2, Users } from 'lucide-react';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernInput } from '@/components/ui/ModernInput';
import { useRouter } from 'next/navigation';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  registrationsCount: number;
  capacity?: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchEvents = async (page: number, search: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events?page=${page}&search=${search}`);
      const data = await response.json();
      if (response.ok) {
        setEvents(data.events);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } else {
        console.error('Failed to fetch events:', data.error);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(currentPage, searchTerm);
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
    router.push(`/events/${id}`);
  };

  const handleViewRegistrations = (id: string) => {
    router.push(`/events/${id}/registrations`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        const response = await fetch(`/api/events/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchEvents(currentPage, searchTerm); // Refresh list
        } else {
          const data = await response.json();
          console.error('Failed to delete event:', data.error);
          alert(`Erro ao excluir evento: ${data.error}`);
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Erro ao excluir evento.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between space-x-3">
          <div className="flex items-center space-x-3">
            <CalendarDays className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
              <p className="text-gray-600 mt-1">Gerencie os eventos e conferências da igreja</p>
            </div>
          </div>
          <ModernButton onClick={() => router.push('/events/new')}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Evento
          </ModernButton>
        </div>

        {/* Search and Filters */}
        <ModernCard variant="outlined" className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <ModernInput
              type="text"
              placeholder="Buscar por nome ou local..."
              value={searchTerm}
              onChange={handleSearch}
              icon={<Search className="w-4 h-4 text-gray-400" />}
              className="flex-grow"
            />
            {/* Add more filters here if needed */}
          </div>
        </ModernCard>

        {/* Events List */}
        <ModernCard className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Carregando eventos...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhum evento encontrado. Comece adicionando um novo!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscrições</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidade</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.registrationsCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.capacity || 'Ilimitada'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <ModernButton variant="ghost" size="sm" onClick={() => handleViewRegistrations(event.id)}>
                            <Users className="w-4 h-4" />
                          </ModernButton>
                          <ModernButton variant="ghost" size="sm" onClick={() => handleEdit(event.id)}>
                            <Edit className="w-4 h-4" />
                          </ModernButton>
                          <ModernButton variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>
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


