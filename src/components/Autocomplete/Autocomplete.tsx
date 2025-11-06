import { useState, useEffect, useRef } from 'react'
import './Autocomplete.css'

interface Props {
  value: string
  onChange: (value: string) => void
  fetchUrl: string
  placeholder?: string
  label?: string
}

export const Autocomplete: React.FC<Props> = ({
  value,
  onChange,
  fetchUrl,
  placeholder = 'Type to search and input 2 or more characters...',
  label,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (value.length < 2) {
        setSuggestions([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`${fetchUrl}${encodeURIComponent(value)}`)
        const data = await response.json()
        setSuggestions(data.map((item: any) => item.name).slice(0, 8))
      } catch (error) {
        console.error('Autocomplete fetch error:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [value, fetchUrl])

  const handleSelect = (suggestion: string) => {
    onChange(suggestion)
    setIsOpen(false)
    setSuggestions([])
  }

  return (
    <div className="autocomplete">
      {label && <label className="autocomplete__label">{label}</label>}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="autocomplete__input"
      />
      {isOpen && (isLoading || suggestions.length > 0) && (
        <ul className="autocomplete__list">
          {isLoading ? (
            <li className="autocomplete__loading">Loading...</li>
          ) : (
            suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="autocomplete__option"
                onClick={() => handleSelect(suggestion)}
              >
                {suggestion}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}