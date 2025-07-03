// types/next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      userid: string
      username: string
    }
  }

  interface User {
    userid: string
    username: string
  }
}
