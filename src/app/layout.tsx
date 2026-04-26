import type { Metadata } from 'next'
import './globals.css'
import { TransactionsProvider } from '../presentation/contexts/TransactionsContext'
import { LayoutShell } from '../presentation/components/LayoutShell'

export const metadata: Metadata = {
  title: 'DT Money — Controle Financeiro',
  description: 'Gerencie suas finanças com facilidade. Controle entradas, saídas e visualize relatórios detalhados.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col bg-dt-bg antialiased">
        <TransactionsProvider>
          <LayoutShell>
            {children}
          </LayoutShell>
        </TransactionsProvider>
      </body>
    </html>
  )
}
