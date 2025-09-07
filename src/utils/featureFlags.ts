export interface FeatureFlag {
  key: string
  name: string
  description: string
  enabled: boolean
  module: string
  createdAt: Date
  updatedAt: Date
}

export const defaultFeatureFlags: Omit<FeatureFlag, 'createdAt' | 'updatedAt'>[] = [
  {
    key: 'people_module',
    name: 'Módulo de Pessoas',
    description: 'Habilita o módulo de gestão de pessoas',
    enabled: true,
    module: 'people'
  },
  {
    key: 'attendance_module',
    name: 'Módulo de Presença',
    description: 'Habilita o módulo de controle de presença',
    enabled: true,
    module: 'attendance'
  },
  {
    key: 'offerings_module',
    name: 'Módulo de Ofertas',
    description: 'Habilita o módulo de gestão de ofertas',
    enabled: true,
    module: 'offerings'
  },
  {
    key: 'groups_module',
    name: 'Módulo de Grupos',
    description: 'Habilita o módulo de gestão de grupos/células',
    enabled: true,
    module: 'groups'
  },
  {
    key: 'events_module',
    name: 'Módulo de Eventos',
    description: 'Habilita o módulo de gestão de eventos',
    enabled: true,
    module: 'events'
  },
  {
    key: 'communication_module',
    name: 'Módulo de Comunicação',
    description: 'Habilita o módulo de comunicação',
    enabled: true,
    module: 'communication'
  },
  {
    key: 'pix_integration',
    name: 'Integração PIX',
    description: 'Habilita pagamentos via PIX',
    enabled: true,
    module: 'offerings'
  },
  {
    key: 'whatsapp_integration',
    name: 'Integração WhatsApp',
    description: 'Habilita envio de mensagens via WhatsApp',
    enabled: false,
    module: 'communication'
  },
  {
    key: 'email_integration',
    name: 'Integração Email',
    description: 'Habilita envio de emails',
    enabled: true,
    module: 'communication'
  },
  {
    key: 'advanced_reports',
    name: 'Relatórios Avançados',
    description: 'Habilita relatórios avançados e analytics',
    enabled: true,
    module: 'reports'
  },
  {
    key: 'multi_campus',
    name: 'Multi-Campus',
    description: 'Habilita gestão de múltiplos campus',
    enabled: true,
    module: 'general'
  },
  {
    key: 'mobile_app',
    name: 'App Mobile',
    description: 'Habilita funcionalidades específicas do app mobile',
    enabled: false,
    module: 'general'
  },
  {
    key: 'push_notifications',
    name: 'Notificações Push',
    description: 'Habilita notificações push',
    enabled: false,
    module: 'general'
  },
  {
    key: 'dark_mode',
    name: 'Modo Escuro',
    description: 'Habilita tema escuro',
    enabled: false,
    module: 'ui'
  },
  {
    key: 'beta_features',
    name: 'Funcionalidades Beta',
    description: 'Habilita funcionalidades em teste',
    enabled: false,
    module: 'general'
  }
]

class FeatureFlagService {
  private flags: Map<string, boolean> = new Map()
  private initialized = false

  async initialize() {
    if (this.initialized) return

    try {
      // In production, this would load from database
      // For now, use environment variables and defaults
      defaultFeatureFlags.forEach(flag => {
        const envKey = `FEATURE_${flag.key.toUpperCase()}`
        const envValue = process.env[envKey]
        
        if (envValue !== undefined) {
          this.flags.set(flag.key, envValue === 'true')
        } else {
          this.flags.set(flag.key, flag.enabled)
        }
      })

      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize feature flags:', error)
      // Fallback to defaults
      defaultFeatureFlags.forEach(flag => {
        this.flags.set(flag.key, flag.enabled)
      })
    }
  }

  async isEnabled(flagKey: string): Promise<boolean> {
    await this.initialize()
    return this.flags.get(flagKey) ?? false
  }

  async getFlags(): Promise<Record<string, boolean>> {
    await this.initialize()
    return Object.fromEntries(this.flags)
  }

  async setFlag(flagKey: string, enabled: boolean): Promise<void> {
    await this.initialize()
    this.flags.set(flagKey, enabled)
    
    // In production, this would update the database
    console.log(`Feature flag ${flagKey} set to ${enabled}`)
  }

  async getFlagsByModule(module: string): Promise<Record<string, boolean>> {
    await this.initialize()
    const moduleFlags: Record<string, boolean> = {}
    
    defaultFeatureFlags
      .filter(flag => flag.module === module)
      .forEach(flag => {
        moduleFlags[flag.key] = this.flags.get(flag.key) ?? false
      })
    
    return moduleFlags
  }
}

// Singleton instance
export const featureFlags = new FeatureFlagService()

// React hook for feature flags
export function useFeatureFlag(flagKey: string) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    featureFlags.isEnabled(flagKey).then(enabled => {
      setIsEnabled(enabled)
      setLoading(false)
    })
  }, [flagKey])

  return { isEnabled, loading }
}

// HOC for conditional rendering based on feature flags
export function withFeatureFlag<P extends object>(
  Component: React.ComponentType<P>,
  flagKey: string,
  fallback?: React.ComponentType<P>
) {
  return function FeatureFlagWrapper(props: P) {
    const { isEnabled, loading } = useFeatureFlag(flagKey)

    if (loading) {
      return <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
    }

    if (!isEnabled) {
      return fallback ? <fallback {...props} /> : null
    }

    return <Component {...props} />
  }
}

// Utility function for server-side feature flag checks
export async function checkFeatureFlag(flagKey: string): Promise<boolean> {
  return await featureFlags.isEnabled(flagKey)
}

// Middleware for API routes
export function withFeatureFlagAPI(flagKey: string) {
  return function middleware(handler: any) {
    return async function wrappedHandler(req: any, res: any) {
      const isEnabled = await featureFlags.isEnabled(flagKey)
      
      if (!isEnabled) {
        return res.status(404).json({
          error: 'Feature not available',
          code: 'FEATURE_DISABLED'
        })
      }

      return handler(req, res)
    }
  }
}

