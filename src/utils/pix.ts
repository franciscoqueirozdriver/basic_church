import { v4 as uuidv4 } from 'uuid'

export interface PixPayment {
  txId: string
  qrCode: string
  copyPaste: string
  amount: number
  description: string
  expiresAt: Date
}

export interface PixWebhookData {
  txId: string
  status: 'PAID' | 'EXPIRED' | 'CANCELLED'
  paidAt?: Date
  amount?: number
}

// Simulated PIX provider - In production, integrate with real PSP
export class PixProvider {
  private static baseUrl = process.env.PIX_PROVIDER_URL || 'https://api.pix-provider.com'
  private static apiKey = process.env.PIX_PROVIDER_KEY || 'test-key'

  static async createPayment(amount: number, description: string): Promise<PixPayment> {
    // Simulate API call to PIX provider
    const txId = uuidv4()
    const qrCode = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`
    
    // Generate PIX copy-paste code (simplified)
    const copyPaste = this.generatePixCode(amount, description, txId)
    
    return {
      txId,
      qrCode,
      copyPaste,
      amount,
      description,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    }
  }

  static async checkPaymentStatus(txId: string): Promise<PixWebhookData> {
    // Simulate API call to check payment status
    // In production, this would call the real PSP API
    return {
      txId,
      status: 'PAID', // Simulate successful payment for demo
      paidAt: new Date(),
      amount: 1000 // Amount in cents
    }
  }

  private static generatePixCode(amount: number, description: string, txId: string): string {
    // Simplified PIX code generation
    // In production, use proper PIX specification
    const amountStr = (amount / 100).toFixed(2)
    return `00020126580014BR.GOV.BCB.PIX0136${txId}520400005303986540${amountStr.length.toString().padStart(2, '0')}${amountStr}5802BR5925IGREJA EXEMPLO6009SAO PAULO62070503***6304${this.calculateCRC16('mock')}`
  }

  private static calculateCRC16(data: string): string {
    // Simplified CRC16 calculation for demo
    // In production, use proper CRC16-CCITT algorithm
    return 'ABCD'
  }

  static async reconcilePayments(): Promise<PixWebhookData[]> {
    // Simulate daily reconciliation
    // In production, this would fetch all pending payments and check their status
    return []
  }
}

export function formatPixAmount(amountInCents: number): string {
  return (amountInCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

export function validatePixAmount(amount: number): boolean {
  return amount >= 100 && amount <= 100000000 // Min R$ 1.00, Max R$ 1,000,000.00
}

