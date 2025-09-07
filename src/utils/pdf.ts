import jsPDF from 'jspdf'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface ReceiptData {
  id: string
  receiptNumber: string
  date: Date
  amount: number
  method: string
  description: string
  person: {
    fullName: string
    email?: string
    phone?: string
  }
  church: {
    name: string
    address?: string
    phone?: string
    cnpj?: string
  }
}

export function generateReceiptPDF(data: ReceiptData): jsPDF {
  const doc = new jsPDF()
  
  // Set font
  doc.setFont('helvetica')
  
  // Header
  doc.setFontSize(20)
  doc.setTextColor(0, 0, 0)
  doc.text(data.church.name, 20, 30)
  
  doc.setFontSize(12)
  if (data.church.address) {
    doc.text(data.church.address, 20, 40)
  }
  if (data.church.phone) {
    doc.text(`Tel: ${data.church.phone}`, 20, 50)
  }
  if (data.church.cnpj) {
    doc.text(`CNPJ: ${data.church.cnpj}`, 20, 60)
  }
  
  // Title
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('RECIBO DE DOAÇÃO', 20, 80)
  
  // Receipt info
  doc.setFontSize(12)
  doc.text(`Recibo Nº: ${data.receiptNumber}`, 20, 100)
  doc.text(`Data: ${format(data.date, 'dd/MM/yyyy', { locale: ptBR })}`, 120, 100)
  
  // Amount box
  doc.setDrawColor(0, 0, 0)
  doc.rect(20, 110, 170, 30)
  doc.setFontSize(14)
  doc.text('Valor:', 25, 125)
  doc.setFontSize(16)
  const formattedAmount = (data.amount / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
  doc.text(formattedAmount, 25, 135)
  
  // Donor info
  doc.setFontSize(12)
  doc.text('Recebemos de:', 20, 160)
  doc.setFontSize(14)
  doc.text(data.person.fullName, 20, 170)
  
  if (data.person.email) {
    doc.setFontSize(10)
    doc.text(`Email: ${data.person.email}`, 20, 180)
  }
  
  if (data.person.phone) {
    doc.setFontSize(10)
    doc.text(`Telefone: ${data.person.phone}`, 20, 190)
  }
  
  // Description
  doc.setFontSize(12)
  doc.text('Referente a:', 20, 210)
  doc.text(data.description, 20, 220)
  
  // Payment method
  doc.text(`Forma de pagamento: ${data.method}`, 20, 230)
  
  // Footer
  doc.setFontSize(10)
  doc.text('Este recibo serve como comprovante de doação para fins de', 20, 250)
  doc.text('declaração de imposto de renda, conforme legislação vigente.', 20, 260)
  
  // Signature line
  doc.line(120, 280, 190, 280)
  doc.text('Assinatura do Responsável', 120, 290)
  
  return doc
}

export interface AnnualReportData {
  year: number
  person: {
    fullName: string
    email?: string
    phone?: string
    cpf?: string
  }
  donations: Array<{
    date: Date
    amount: number
    method: string
    description: string
    receiptNumber?: string
  }>
  church: {
    name: string
    address?: string
    phone?: string
    cnpj?: string
  }
}

export function generateAnnualReportPDF(data: AnnualReportData): jsPDF {
  const doc = new jsPDF()
  
  // Set font
  doc.setFont('helvetica')
  
  // Header
  doc.setFontSize(18)
  doc.text(data.church.name, 20, 30)
  
  doc.setFontSize(12)
  if (data.church.address) {
    doc.text(data.church.address, 20, 40)
  }
  if (data.church.phone) {
    doc.text(`Tel: ${data.church.phone}`, 20, 50)
  }
  if (data.church.cnpj) {
    doc.text(`CNPJ: ${data.church.cnpj}`, 20, 60)
  }
  
  // Title
  doc.setFontSize(16)
  doc.text(`RELATÓRIO ANUAL DE DOAÇÕES - ${data.year}`, 20, 80)
  
  // Donor info
  doc.setFontSize(12)
  doc.text('Doador:', 20, 100)
  doc.setFontSize(14)
  doc.text(data.person.fullName, 20, 110)
  
  if (data.person.cpf) {
    doc.setFontSize(10)
    doc.text(`CPF: ${data.person.cpf}`, 20, 120)
  }
  
  // Summary
  const totalAmount = data.donations.reduce((sum, d) => sum + d.amount, 0)
  doc.setFontSize(12)
  doc.text('Resumo:', 20, 140)
  doc.text(`Total de doações: ${data.donations.length}`, 20, 150)
  doc.text(`Valor total: ${(totalAmount / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })}`, 20, 160)
  
  // Donations table header
  let yPosition = 180
  doc.setFontSize(10)
  doc.text('Data', 20, yPosition)
  doc.text('Descrição', 50, yPosition)
  doc.text('Método', 120, yPosition)
  doc.text('Valor', 160, yPosition)
  
  // Draw header line
  doc.line(20, yPosition + 2, 190, yPosition + 2)
  yPosition += 10
  
  // Donations list
  data.donations.forEach((donation, index) => {
    if (yPosition > 270) {
      doc.addPage()
      yPosition = 30
    }
    
    doc.text(format(donation.date, 'dd/MM/yy', { locale: ptBR }), 20, yPosition)
    doc.text(donation.description.substring(0, 25), 50, yPosition)
    doc.text(donation.method, 120, yPosition)
    doc.text((donation.amount / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }), 160, yPosition)
    
    yPosition += 8
  })
  
  // Footer
  doc.setFontSize(8)
  doc.text('Este relatório foi gerado automaticamente pelo sistema de gestão da igreja.', 20, 280)
  doc.text(`Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 20, 290)
  
  return doc
}

