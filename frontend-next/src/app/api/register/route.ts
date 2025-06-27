import { hash } from 'bcrypt'
import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, username, password } = await req.json()

  if (!email || !username || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const client = await clientPromise
  const db = client.db('ZLALOON')
  const users = db.collection('Users')

  const existing = await users.findOne({
    $or: [{ email }, { username }]
  })

  if (existing) {
    return NextResponse.json({ error: 'Email or username already taken' }, { status: 400 })
  }

  const hashed = await hash(password, 10)
  await users.insertOne({
    email,
    username,
    password: hashed
  })

  return NextResponse.json({ success: true })
}
