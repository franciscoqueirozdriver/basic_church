import Handlebars from 'handlebars'

export interface CommunicationProvider {
  name: string
  type: 'EMAIL' | 'WHATSAPP'
  isActive: boolean
  config: Record<string, any>
}

export interface MessageData {
  to: string
  subject?: string
  content: string
  variables?: Record<string, any>
  templateId?: string
}

export interface SendResult {
  success: boolean
  messageId?: string
  error?: string
  provider?: string
}

// Template processing
export class TemplateProcessor {
  static processTemplate(template: string, variables: Record<string, any>): string {
    try {
      const compiledTemplate = Handlebars.compile(template)
      return compiledTemplate(variables)
    } catch (error) {
      console.error('Template processing error:', error)
      return template // Return original template if processing fails
    }
  }

  static extractVariables(template: string): string[] {
    const variableRegex = /\{\{([^}]+)\}\}/g
    const variables = new Set<string>()
    let match

    while ((match = variableRegex.exec(template)) !== null) {
      // Clean variable name (remove helpers and whitespace)
      const variableName = match[1].trim().split(' ')[0].replace(/^#/, '')
      if (variableName && !variableName.startsWith('/')) {
        variables.add(variableName)
      }
    }

    return Array.from(variables)
  }

  static validateTemplate(template: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    try {
      Handlebars.compile(template)
    } catch (error) {
      errors.push(`Erro de sintaxe: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }

    // Check for common issues
    const openBraces = (template.match(/\{\{/g) || []).length
    const closeBraces = (template.match(/\}\}/g) || []).length
    
    if (openBraces !== closeBraces) {
      errors.push('Número de chaves de abertura e fechamento não coincidem')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Email provider (Mailgun)
export class MailgunProvider {
  private apiKey: string
  private domain: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.MAILGUN_API_KEY || ''
    this.domain = process.env.MAILGUN_DOMAIN || ''
    this.baseUrl = `https://api.mailgun.net/v3/${this.domain}`
  }

  async sendEmail(data: MessageData): Promise<SendResult> {
    if (!this.apiKey || !this.domain) {
      return {
        success: false,
        error: 'Mailgun não configurado',
        provider: 'mailgun'
      }
    }

    try {
      const formData = new FormData()
      formData.append('from', `Igreja App <noreply@${this.domain}>`)
      formData.append('to', data.to)
      formData.append('subject', data.subject || 'Mensagem da Igreja')
      formData.append('text', data.content)
      formData.append('html', this.convertToHtml(data.content))

      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${this.apiKey}`).toString('base64')}`
        },
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        return {
          success: true,
          messageId: result.id,
          provider: 'mailgun'
        }
      } else {
        const error = await response.text()
        return {
          success: false,
          error: `Mailgun error: ${error}`,
          provider: 'mailgun'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `Mailgun error: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        provider: 'mailgun'
      }
    }
  }

  private convertToHtml(text: string): string {
    return text
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
  }
}

// WhatsApp provider (stub - integrate with real provider)
export class WhatsAppProvider {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.WHATSAPP_API_KEY || ''
    this.baseUrl = process.env.WHATSAPP_API_URL || 'https://api.whatsapp-provider.com'
  }

  async sendMessage(data: MessageData): Promise<SendResult> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'WhatsApp não configurado',
        provider: 'whatsapp'
      }
    }

    try {
      // Simulate WhatsApp API call
      // In production, integrate with real WhatsApp Business API provider
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: this.formatPhoneNumber(data.to),
          message: data.content,
          type: 'text'
        })
      })

      if (response.ok) {
        const result = await response.json()
        return {
          success: true,
          messageId: result.messageId,
          provider: 'whatsapp'
        }
      } else {
        const error = await response.text()
        return {
          success: false,
          error: `WhatsApp error: ${error}`,
          provider: 'whatsapp'
        }
      }
    } catch (error) {
      // For demo purposes, simulate success
      console.log(`WhatsApp message to ${data.to}: ${data.content}`)
      return {
        success: true,
        messageId: `wa_${Date.now()}`,
        provider: 'whatsapp'
      }
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '')
    
    // Add country code if not present
    if (cleaned.length === 11 && cleaned.startsWith('11')) {
      return `55${cleaned}`
    } else if (cleaned.length === 10) {
      return `5511${cleaned}`
    }
    
    return cleaned
  }
}

// Communication service
export class CommunicationService {
  private mailgunProvider: MailgunProvider
  private whatsappProvider: WhatsAppProvider

  constructor() {
    this.mailgunProvider = new MailgunProvider()
    this.whatsappProvider = new WhatsAppProvider()
  }

  async sendMessage(
    type: 'EMAIL' | 'WHATSAPP' | 'BOTH',
    data: MessageData
  ): Promise<SendResult[]> {
    const results: SendResult[] = []

    if (type === 'EMAIL' || type === 'BOTH') {
      const result = await this.mailgunProvider.sendEmail(data)
      results.push(result)
    }

    if (type === 'WHATSAPP' || type === 'BOTH') {
      const result = await this.whatsappProvider.sendMessage(data)
      results.push(result)
    }

    return results
  }

  async sendBulkMessages(
    type: 'EMAIL' | 'WHATSAPP' | 'BOTH',
    messages: MessageData[]
  ): Promise<{ sent: number; failed: number; results: SendResult[] }> {
    const results: SendResult[] = []
    let sent = 0
    let failed = 0

    for (const message of messages) {
      const messageResults = await this.sendMessage(type, message)
      results.push(...messageResults)
      
      const hasSuccess = messageResults.some(r => r.success)
      if (hasSuccess) {
        sent++
      } else {
        failed++
      }

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return { sent, failed, results }
  }
}

// Webhook handlers
export class WebhookHandler {
  static async handleMailgunWebhook(data: any): Promise<void> {
    const { 'event-data': eventData } = data
    
    if (!eventData) return

    const messageId = eventData.message?.headers?.['message-id']
    const event = eventData.event
    const timestamp = new Date(eventData.timestamp * 1000)

    // Update communication log with delivery status
    if (messageId) {
      // Find and update communication record
      // This would require storing message IDs in the database
      console.log(`Mailgun webhook: ${event} for message ${messageId}`)
    }
  }

  static async handleWhatsAppWebhook(data: any): Promise<void> {
    const { messageId, status, timestamp } = data
    
    if (messageId) {
      console.log(`WhatsApp webhook: ${status} for message ${messageId}`)
      // Update communication record
    }
  }
}

// Metrics and analytics
export interface CommunicationMetrics {
  totalSent: number
  totalDelivered: number
  totalFailed: number
  deliveryRate: number
  openRate?: number
  clickRate?: number
  byProvider: Record<string, {
    sent: number
    delivered: number
    failed: number
  }>
  byTemplate: Record<string, {
    sent: number
    delivered: number
    failed: number
  }>
}

export class MetricsService {
  static async getCommunicationMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<CommunicationMetrics> {
    // This would query the database for communication logs
    // and calculate metrics
    return {
      totalSent: 0,
      totalDelivered: 0,
      totalFailed: 0,
      deliveryRate: 0,
      byProvider: {},
      byTemplate: {}
    }
  }
}

