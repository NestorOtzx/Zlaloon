import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'
import { compare } from 'bcrypt'

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log("authorize() called", credentials)

        const client = await clientPromise
        const db = client.db("ZLALOON")

        const user = await db.collection('Users').findOne({
          $or: [
            { email: credentials?.email },
            { username: credentials?.email },
          ]
        })

        if (!user) {
          console.log("No user found")
          return null
        }

        // Solo para testing sin hash
        let isValid = credentials!.password === user.password
        if (!isValid)
          isValid = await compare(credentials!.password, user.password)

        if (!isValid) {
          console.log("Invalid password")
          return null
        }

        console.log("Auth success:", {
          id: user._id.toString(),
          name: user.username,
          email: user.email
        })

        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user && token?.id) {
        session.user._id = token.id as string
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
