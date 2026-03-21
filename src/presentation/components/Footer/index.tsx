import { TrendingUp, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-dt-border bg-dt-surface">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-dt-purple">
              <TrendingUp className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">
              DT<span className="text-dt-purple">Money</span>
            </span>
          </div>

          <p className="text-center text-sm text-dt-muted">
            Desenvolvido com{' '}
            <span className="text-dt-red">♥</span>
            {' '}por{' '}
            <a
              href="https://www.linkedin.com/in/juan-evangelista/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-dt-purple-light hover:text-white transition-colors group"
            >
              Juan Evangelista
              <Linkedin className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
            </a>
          </p>

          <p className="text-xs text-dt-muted/60">
            © {new Date().getFullYear()} DT Money
          </p>
        </div>
      </div>
    </footer>
  )
}
