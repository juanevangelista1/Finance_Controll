import type { Metadata } from 'next'
import './globals.css'
import { TransactionsProvider } from '../presentation/contexts/TransactionsContext'
import { Header } from '../presentation/components/Header'
import { Footer } from '../presentation/components/Footer'

export const metadata: Metadata = {
  title: 'DT Money — Controle Financeiro',
  description: 'Gerencie suas finanças com facilidade. Controle entradas, saídas e visualize relatórios detalhados.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col bg-dt-bg antialiased">
        <TransactionsProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </TransactionsProvider>
      </body>
    </html>
  )
}
