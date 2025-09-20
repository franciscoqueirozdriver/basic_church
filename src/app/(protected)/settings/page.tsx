'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Palette, Image as ImageIcon, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { ModernCard } from '@/components/ui/ModernCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { LogoUpload } from '@/components/ui/LogoUpload';

interface ChurchConfig {
  id?: string;
  logoUrl?: string | null;
  logoWidth?: number;
  logoHeight?: number;
  logoPosition?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  colorPaletteSource?: string;
}

export default function SettingsPage() {
  const [config, setConfig] = useState<ChurchConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/config/logo');
      const data = await response.json();
      
      if (response.ok) {
        setConfig(data.config || {});
      } else {
        showMessage('error', 'Erro ao carregar configurações');
      }
    } catch (error) {
      console.error('Error fetching config:', error);
      showMessage('error', 'Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleLogoUploadSuccess = (result: any) => {
    setConfig(prev => ({
      ...prev,
      logoUrl: result.config.logoUrl,
      logoWidth: result.config.logoWidth,
      logoHeight: result.config.logoHeight,
    }));
    showMessage('success', 'Logo enviada com sucesso!');
  };

  const handleLogoUploadError = (error: string) => {
    showMessage('error', error);
  };

  const handleRemoveLogo = () => {
    setConfig(prev => ({
      ...prev,
      logoUrl: null,
      logoWidth: 120,
      logoHeight: 40,
    }));
    showMessage('success', 'Logo removida com sucesso!');
  };

  const handleLogoPositionChange = (position: string) => {
    setConfig(prev => ({ ...prev, logoPosition: position }));
  };

  const saveLogoPosition = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/config/logo-position', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoPosition: config.logoPosition }),
      });

      if (response.ok) {
        showMessage('success', 'Posição da logo salva com sucesso!');
      } else {
        const data = await response.json();
        showMessage('error', data.error || 'Erro ao salvar posição');
      }
    } catch (error) {
      console.error('Error saving position:', error);
      showMessage('error', 'Erro ao salvar posição');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Settings className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600 mt-1">Personalize a aparência do sistema</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`
            flex items-center space-x-2 p-4 rounded-lg border
            ${message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
            }
          `}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Logo Upload Section */}
        <div className="space-y-6">
          <LogoUpload
            currentLogoUrl={config.logoUrl}
            onUploadSuccess={handleLogoUploadSuccess}
            onUploadError={handleLogoUploadError}
            onRemoveLogo={handleRemoveLogo}
          />

          {/* Logo Position Settings */}
          {config.logoUrl && (
            <ModernCard variant="outlined" className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Posicionamento da Logo</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'header-left', label: 'Cabeçalho - Esquerda' },
                    { value: 'header-center', label: 'Cabeçalho - Centro' },
                    { value: 'sidebar-top', label: 'Sidebar - Topo' },
                    { value: 'sidebar-bottom', label: 'Sidebar - Rodapé' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`
                        flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors
                        ${config.logoPosition === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="logoPosition"
                        value={option.value}
                        checked={config.logoPosition === option.value}
                        onChange={(e) => handleLogoPositionChange(e.target.value)}
                        className="text-blue-600"
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-end">
                  <ModernButton
                    onClick={saveLogoPosition}
                    disabled={saving}
                    className="min-w-[120px]"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Posição
                      </>
                    )}
                  </ModernButton>
                </div>
              </div>
            </ModernCard>
          )}

          {/* Color Palette Section - Coming Soon */}
          <ModernCard variant="outlined" className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Paleta de Cores</h3>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                  Em breve
                </span>
              </div>

              <div className="text-gray-600">
                <p className="mb-3">
                  Quando você enviar uma logo, o sistema analisará automaticamente as cores 
                  e sugerirá uma paleta personalizada para todo o sistema.
                </p>
                
                {config.logoUrl ? (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 text-sm">
                      ✨ Logo detectada! A funcionalidade de extração de cores será 
                      implementada na próxima atualização.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-600 text-sm">
                      📤 Envie uma logo primeiro para habilitar a personalização de cores.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
}

