'use client'

import { useState, useRef, type KeyboardEvent } from 'react'
import { X, Tag } from 'lucide-react'

interface SmartTagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  placeholder?: string
  maxTags?: number
}

const DEFAULT_SUGGESTIONS = [
  'urgente', 'recorrente', 'parcelado', 'à vista',
  'necessidade', 'supérfluo', 'investimento', 'fixo',
]

export function SmartTagInput({
  tags,
  onChange,
  suggestions = DEFAULT_SUGGESTIONS,
  placeholder = 'Adicionar tag...',
  maxTags = 5,
}: SmartTagInputProps) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(input.toLowerCase()) &&
      !tags.includes(s),
  )

  function addTag(tag: string) {
    const trimmed = tag.trim().toLowerCase()
    if (!trimmed || tags.includes(trimmed) || tags.length >= maxTags) return
    onChange([...tags, trimmed])
    setInput('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-[2.75rem] w-full rounded-xl border border-dt-border bg-dt-card px-3 py-2 transition-all focus-within:border-dt-purple/60 focus-within:ring-2 focus-within:ring-dt-purple/20">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-lg bg-dt-purple/20 px-2.5 py-1 text-xs font-medium text-dt-purple-light animate-fade-in"
          >
            <Tag className="h-3 w-3" />
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="cursor-pointer ml-0.5 rounded-full p-0.5 hover:bg-dt-purple/30 transition-colors"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        {tags.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setShowSuggestions(true)
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[80px] bg-transparent text-sm text-white placeholder:text-dt-muted/60 outline-none"
          />
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && input.length > 0 && (
        <div className="rounded-xl border border-dt-border bg-dt-surface p-1.5 shadow-xl animate-fade-in">
          <div className="flex flex-wrap gap-1.5">
            {filteredSuggestions.slice(0, 6).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  addTag(suggestion)
                }}
                className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-dt-border bg-dt-card px-2.5 py-1 text-xs text-dt-muted hover:text-white hover:border-dt-purple/40 hover:bg-dt-purple/10 transition-all"
              >
                <Tag className="h-3 w-3" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick suggestions when empty */}
      {tags.length === 0 && !input && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.slice(0, 4).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-dashed border-dt-border px-2 py-0.5 text-xs text-dt-muted/60 hover:text-dt-muted hover:border-dt-border/80 transition-all"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
