export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET não configurado. Defina a variável de ambiente JWT_SECRET.')
  }
  return new TextEncoder().encode(secret)
}
