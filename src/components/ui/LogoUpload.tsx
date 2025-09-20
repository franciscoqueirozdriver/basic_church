'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ModernButton } from './ModernButton';
import { ModernCard } from './ModernCard';

interface LogoUploadProps {
  currentLogoUrl?: string | null;
  onUploadSuccess?: (result: any) => void;
  onUploadError?: (error: string) => void;
  onRemoveLogo?: () => void;
  disabled?: boolean;
}

export function LogoUpload({
  currentLogoUrl,
  onUploadSuccess,
  onUploadError,
  onRemoveLogo,
  disabled = false,
}: LogoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    } else {
      onUploadError?.('Por favor, selecione um arquivo de imagem válido.');
    }
  }, [disabled, onUploadError]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    if (disabled) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      onUploadError?.('O arquivo é muito grande. O tamanho máximo é 5MB.');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      onUploadError?.('Formato não suportado. Use JPEG, PNG, WebP ou SVG.');
      return;
    }

    setIsUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('logo', file);

      const response = await fetch('/api/config/logo', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao fazer upload da logo');
      }

      onUploadSuccess?.(result);
      setPreview(null);
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.(error instanceof Error ? error.message : 'Erro ao fazer upload');
      setPreview(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (disabled) return;

    try {
      const response = await fetch('/api/config/logo', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Erro ao remover logo');
      }

      onRemoveLogo?.();
    } catch (error) {
      console.error('Remove error:', error);
      onUploadError?.(error instanceof Error ? error.message : 'Erro ao remover logo');
    }
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const displayImage = preview || currentLogoUrl;

  return (
    <ModernCard variant="outlined" className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Logo da Igreja</h3>
          {currentLogoUrl && !isUploading && (
            <ModernButton
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-1" />
              Remover
            </ModernButton>
          )}
        </div>

        {displayImage ? (
          <div className="relative">
            <div className="flex justify-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <img
                src={displayImage}
                alt="Logo da igreja"
                className="max-h-24 max-w-full object-contain"
                style={{ filter: preview ? 'opacity(0.7)' : 'none' }}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              )}
            </div>
            {!isUploading && (
              <div className="mt-2 text-center">
                <ModernButton
                  variant="outline"
                  size="sm"
                  onClick={openFileDialog}
                  disabled={disabled}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Alterar Logo
                </ModernButton>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragging 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-sm text-gray-600">Processando logo...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <ImageIcon className="w-12 h-12 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Clique para selecionar ou arraste a logo aqui
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WebP ou SVG até 5MB
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Recomendado: 300x120px ou proporção similar
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        <div className="text-xs text-gray-500 space-y-1">
          <p>• A logo será redimensionada automaticamente para manter a qualidade</p>
          <p>• Será exibida discretamente no cabeçalho do sistema</p>
          <p>• As cores da logo podem ser usadas para personalizar o tema</p>
        </div>
      </div>
    </ModernCard>
  );
}

