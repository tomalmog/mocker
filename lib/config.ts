// Configuration management with type-safe environment variables

export const config = {
  app: {
    env: process.env.NODE_ENV || 'development',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  ai: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  },

  database: {
    url: process.env.DATABASE_URL || '',
    user: process.env.POSTGRES_USER || '',
    password: process.env.POSTGRES_PASSWORD || '',
    name: process.env.POSTGRES_DB || '',
  },

  redis: {
    url: process.env.REDIS_URL || '',
    password: process.env.REDIS_PASSWORD || '',
  },

  codeExecution: {
    provider: (process.env.CODE_EXECUTION_PROVIDER || 'piston') as 'piston' | 'judge0',
    judge0: {
      apiKey: process.env.JUDGE0_API_KEY || '',
      apiUrl: process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com',
    },
    piston: {
      apiUrl: process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston',
    },
  },

  auth: {
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    secret: process.env.NEXTAUTH_SECRET || '',
  },

  speech: {
    sttProvider: (process.env.SPEECH_TO_TEXT_PROVIDER || 'deepgram') as 'deepgram' | 'openai',
    ttsProvider: (process.env.TEXT_TO_SPEECH_PROVIDER || 'elevenlabs') as 'elevenlabs' | 'openai',
    deepgram: {
      apiKey: process.env.DEEPGRAM_API_KEY || '',
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
    },
    elevenlabs: {
      apiKey: process.env.ELEVENLABS_API_KEY || '',
      voiceId: process.env.ELEVENLABS_VOICE_ID || '',
    },
  },

  rateLimit: {
    freeInterviewsPerWeek: parseInt(process.env.RATE_LIMIT_FREE_INTERVIEWS_PER_WEEK || '3', 10),
    proInterviewsPerWeek: parseInt(process.env.RATE_LIMIT_PRO_INTERVIEWS_PER_WEEK || '999', 10),
  },

  features: {
    voiceMode: process.env.NEXT_PUBLIC_ENABLE_VOICE_MODE === 'true',
    avatar: process.env.NEXT_PUBLIC_ENABLE_AVATAR === 'true',
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    priceIdProMonthly: process.env.STRIPE_PRICE_ID_PRO_MONTHLY || '',
  },
} as const;

// Validation helper to check required env vars
export function validateConfig() {
  const errors: string[] = [];

  if (!config.ai.anthropicApiKey) {
    errors.push('ANTHROPIC_API_KEY is required');
  }

  if (!config.auth.secret && config.app.env === 'production') {
    errors.push('NEXTAUTH_SECRET is required in production');
  }

  if (errors.length > 0) {
    console.warn('Configuration warnings:', errors);
  }

  return errors;
}
