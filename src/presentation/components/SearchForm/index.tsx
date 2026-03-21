'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Search, X } from 'lucide-react'
import { useTransactionsContext } from '../../contexts/TransactionsContext'

const schema = z.object({
  query: z.string(),
})

type FormData = z.infer<typeof schema>

export function SearchForm() {
  const { setFilter } = useTransactionsContext()
  const { register, handleSubmit, reset, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { query: '' },
  })

  const queryValue = watch('query')

  function onSubmit(data: FormData) {
    setFilter({ query: data.query })
  }

  function clearSearch() {
    reset()
    setFilter({ query: '' })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dt-muted" />
        <input
          {...register('query')}
          type="text"
          placeholder="Buscar por descrição ou categoria..."
          className="h-11 w-full rounded-xl border border-dt-border bg-dt-card pl-10 pr-10 text-sm text-white placeholder:text-dt-muted focus:border-dt-purple/60 focus:outline-none focus:ring-2 focus:ring-dt-purple/20 transition-all"
        />
        {queryValue && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-dt-muted hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="flex cursor-pointer items-center gap-2 rounded-xl bg-dt-purple px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-dt-purple/25 transition-all hover:bg-dt-purple-dark active:scale-95"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Buscar</span>
      </button>
    </form>
  )
}
