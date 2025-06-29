import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      _id?: string         // ✅ añadimos _id aquí
    }
  }

  interface User {
    _id?: string           // ✅ también en User para usar en `authorize` y `jwt`
  }

  interface JWT {
    id?: string
  }
}