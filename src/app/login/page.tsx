'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, Lock, User, Eye, EyeOff, LogIn } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        router.push('/')
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Credenciais inválidas')
      }
    } catch {
      setError('Erro ao conectar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dt-bg px-4">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-dt-purple shadow-lg shadow-dt-purple/30">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">
            DT<span className="text-dt-purple">Money</span>
          </h1>
          <p className="mt-2 text-sm text-dt-muted">Entre para acessar seu controle financeiro</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-dt-border bg-dt-card p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-dt-muted mb-2">Usuário</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dt-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu usuário"
                  required
                  autoFocus
                  className="w-full rounded-xl border border-dt-border bg-dt-surface pl-10 pr-4 py-3 text-sm text-white placeholder:text-dt-muted/50 focus:border-dt-purple focus:outline-none focus:ring-2 focus:ring-dt-purple/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-dt-muted mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dt-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                  className="w-full rounded-xl border border-dt-border bg-dt-surface pl-10 pr-12 py-3 text-sm text-white placeholder:text-dt-muted/50 focus:border-dt-purple focus:outline-none focus:ring-2 focus:ring-dt-purple/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dt-muted hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-dt-red/20 bg-dt-red/10 px-4 py-3 text-sm text-dt-red">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-dt-purple px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-dt-purple/25 transition-all hover:bg-dt-purple-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn className="h-4 w-4" />
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-dt-muted">
          Desenvolvido por{' '}
          <a
            href="https://www.linkedin.com/in/juan-evangelista"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dt-purple hover:underline"
          >
            Juan Evangelista
          </a>
        </p>
      </div>
    </div>
  )
}
