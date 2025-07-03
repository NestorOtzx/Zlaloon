import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'
import { compare } from 'bcrypt'
import type { AuthOptions } from 'next-auth'

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
        const client = await clientPromise
        const db = client.db('ZLALOON')

        const user = await db.collection('Users').findOne({
          $or: [
            { email: credentials?.email },
            { username: credentials?.email },
          ]
        })

        if (!user) return null

        const isValid = credentials!.password === user.password || await compare(credentials!.password, user.password)
        if (!isValid) return null

        // Aquí retornamos un objeto que coincide con los tipos personalizados
        return {
          userid: user._id.toString(),
          username: user.username,
        } as any
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.userid = user.userid
        token.username = user.username
      }
      return token
    },
    async session({ session, token }: any) {
      session.user = {
        userid: token.userid,
        username: token.username,
      }
      return session
    }
  },
  debug: true,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
