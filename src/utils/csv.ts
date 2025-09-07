import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface CSVColumn {
  key: string
  label: string
  format?: (value: any) => string
}

export function generateCSV<T extends Record<string, any>>(
  data: T[],
  columns: CSVColumn[]
): string {
  // Generate header
  const header = columns.map(col => `"${col.label}"`).join(',')
  
  // Generate rows
  const rows = data.map(item => {
    return columns.map(col => {
      let value = item[col.key]
      
      // Apply custom formatting if provided
      if (col.format && value !== null && value !== undefined) {
        value = col.format(value)
      }
      
      // Handle null/undefined values
      if (value === null || value === undefined) {
        value = ''
      }
      
      // Convert to string and escape quotes
      const stringValue = String(value).replace(/"/g, '""')
      
      return `"${stringValue}"`
    }).join(',')
  })
  
  return [header, ...rows].join('\n')
}

export const offeringsCSVColumns: CSVColumn[] = [
  { key: 'id', label: 'ID' },
  { 
    key: 'date', 
    label: 'Data',
    format: (date: Date) => format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })
  },
  { key: 'origin', label: 'Origem' },
  { key: 'method', label: 'Método' },
  { 
    key: 'amount', 
    label: 'Valor',
    format: (amount: number) => (amount / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  },
  { key: 'description', label: 'Descrição' },
  { key: 'notes', label: 'Observações' },
  { key: 'pixTxId', label: 'ID PIX' },
  { key: 'pixStatus', label: 'Status PIX' },
  { key: 'service.name', label: 'Serviço' },
  { key: 'campus.name', label: 'Campus' },
  { 
    key: 'createdAt', 
    label: 'Criado em',
    format: (date: Date) => format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR })
  }
]

export const attendanceCSVColumns: CSVColumn[] = [
  { key: 'id', label: 'ID' },
  { key: 'person.fullName', label: 'Nome' },
  { key: 'person.email', label: 'Email' },
  { key: 'person.phone', label: 'Telefone' },
  { key: 'service.name', label: 'Serviço' },
  { 
    key: 'service.date', 
    label: 'Data do Serviço',
    format: (date: Date) => format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })
  },
  { key: 'status', label: 'Status' },
  { key: 'notes', label: 'Observações' },
  { 
    key: 'createdAt', 
    label: 'Registrado em',
    format: (date: Date) => format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR })
  }
]

export const peopleCSVColumns: CSVColumn[] = [
  { key: 'id', label: 'ID' },
  { key: 'firstName', label: 'Nome' },
  { key: 'lastName', label: 'Sobrenome' },
  { key: 'fullName', label: 'Nome Completo' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Telefone' },
  { 
    key: 'birthDate', 
    label: 'Data de Nascimento',
    format: (date: Date) => date ? format(new Date(date), 'dd/MM/yyyy', { locale: ptBR }) : ''
  },
  { key: 'gender', label: 'Gênero' },
  { key: 'maritalStatus', label: 'Estado Civil' },
  { key: 'address', label: 'Endereço' },
  { key: 'city', label: 'Cidade' },
  { key: 'state', label: 'Estado' },
  { key: 'zipCode', label: 'CEP' },
  { key: 'household.name', label: 'Família' },
  { 
    key: 'joinDate', 
    label: 'Data de Ingresso',
    format: (date: Date) => date ? format(new Date(date), 'dd/MM/yyyy', { locale: ptBR }) : ''
  },
  { 
    key: 'baptismDate', 
    label: 'Data do Batismo',
    format: (date: Date) => date ? format(new Date(date), 'dd/MM/yyyy', { locale: ptBR }) : ''
  },
  { key: 'isActive', label: 'Ativo', format: (active: boolean) => active ? 'Sim' : 'Não' },
  { 
    key: 'createdAt', 
    label: 'Cadastrado em',
    format: (date: Date) => format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR })
  }
]

export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null
  }, obj)
}

export function flattenDataForCSV<T extends Record<string, any>>(
  data: T[],
  columns: CSVColumn[]
): Record<string, any>[] {
  return data.map(item => {
    const flattened: Record<string, any> = {}
    
    columns.forEach(col => {
      flattened[col.key] = getNestedValue(item, col.key)
    })
    
    return flattened
  })
}

