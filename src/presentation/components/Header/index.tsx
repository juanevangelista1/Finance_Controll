'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TrendingUp, BarChart2, Menu, X, Plus } from 'lucide-react'
import { NewTransactionModal } from '../NewTransactionModal'
import { cn } from '../../../shared/utils/cn'

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/reports', label: 'Relatórios' },
  ]

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-dt-border bg-dt-surface/95 backdrop-blur supports-[backdrop-filter]:bg-dt-surface/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dt-purple transition-transform group-hover:scale-110">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                DT<span className="text-dt-purple">Money</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-dt-purple/20 text-dt-purple-light'
                      : 'text-dt-muted hover:text-white hover:bg-white/5',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-dt-purple px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-dt-purple/25 transition-all hover:bg-dt-purple-dark hover:shadow-dt-purple/40 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Nova transação</span>
                <span className="sm:hidden">Nova</span>
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg text-dt-muted hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Menu"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Nav Dropdown */}
          {menuOpen && (
            <div className="md:hidden border-t border-dt-border pb-3 pt-2 animate-fade-in">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    pathname === link.href
                      ? 'text-dt-purple-light bg-dt-purple/10'
                      : 'text-dt-muted hover:text-white hover:bg-white/5',
                  )}
                >
                  {link.href === '/' ? <TrendingUp className="h-4 w-4" /> : <BarChart2 className="h-4 w-4" />}
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <NewTransactionModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
