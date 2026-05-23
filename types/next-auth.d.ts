import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      currentTier: number
      totalPoints: number
      role: string
    } & DefaultSession['user']
  }

  interface User {
    currentTier?: number
    totalPoints?: number
    role?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    currentTier: number
    totalPoints: number
    role: string
  }
}