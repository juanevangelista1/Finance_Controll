import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'

type User = { username: string; password: string }

function getUsers(): User[] {
  try {
    const usersJson = process.env.AUTH_USERS
    if (usersJson) return JSON.parse(usersJson)
  } catch { /* invalid JSON, fall through to legacy vars */ }

  // backward-compat: single user via AUTH_USERNAME / AUTH_PASSWORD
  if (process.env.AUTH_USERNAME && process.env.AUTH_PASSWORD) {
    return [{ username: process.env.AUTH_USERNAME, password: process.env.AUTH_PASSWORD }]
  }

  return []
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    const users = getUsers()
    const match = users.find((u) => u.username === username && u.password === password)

    if (!match) {
      return NextResponse.json({ error: 'Usuário ou senha incorretos' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')
    const token = await new SignJWT({ username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret)

    const response = NextResponse.json({ success: true })
    response.cookies.set('dt-money-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}
