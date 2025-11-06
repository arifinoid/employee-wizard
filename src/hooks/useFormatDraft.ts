import { useEffect, useRef } from 'react'
import { useDebounce } from './useDebounce'

export function useFormDraft(role: string | undefined, payload: any, onRestore?: (draft: any) => void) {
  const restoredRef = useRef(false)

  useEffect(() => {
    if (!role) return
    try {
      const raw = localStorage.getItem(`draft_${role}`)
      if (raw && !restoredRef.current) {
        const draft = JSON.parse(raw)
        if (onRestore) {
          onRestore(draft)
        }
        restoredRef.current = true
      }
    } catch (e) {
      console.warn('useFormDraft: restore failed', e)
    }

  }, [role, onRestore])

  const debouncedPayload = useDebounce(payload, 2000)

  useEffect(() => {
    if (!role) return
    try {
      localStorage.setItem(`draft_${role}`, JSON.stringify(debouncedPayload))
    } catch (e) {
      console.warn('useFormDraft: save failed', e)
    }
  }, [role, debouncedPayload])
}