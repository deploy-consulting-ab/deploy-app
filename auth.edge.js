import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

/**
 * Edge-compatible auth configuration for middleware.
 * This version does NOT include:
 * - PrismaAdapter (not compatible with Edge Runtime)
 * - bcryptjs (Node.js native module)
 * - Database queries
 * 
 * The middleware only needs to verify JWT tokens, not authenticate users.
 * Full authentication happens in auth.js on the server side.
 */
const authConfig = {
  trustHost: true,
  providers: [
    // Credentials provider without authorize function
    // (authorize is only called during sign-in, not in middleware)
    Credentials({}),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // JWT callback only reads from existing token in middleware
    async jwt({ token }) {
      return token
    },
    // Session callback builds session from token data
    async session({ session, token }) {
      if (!session.user) {
        return session
      }

      if (token.sub) {
        session.user.sessionId = token.sub
      }

      if (token.systemPermissions) {
        session.user.systemPermissions = token.systemPermissions
      }

      if (token.isActive) {
        session.user.isActive = token.isActive
      }

      // Handle impersonation
      if (token.impersonating) {
        session.user.impersonating = true
        session.user.originalUser = token.originalUser
        session.user.sessionId = token.impersonatedUser.id
        session.user.systemPermissions = token.impersonatedUser.systemPermissions
        session.user.isActive = token.impersonatedUser.isActive
      }

      return session
    },
  },
}

export const { auth } = NextAuth(authConfig)

