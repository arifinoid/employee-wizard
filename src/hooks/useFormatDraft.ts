import { useEffect, useRef } from 'react'

export function useFormDraft(role: string | undefined, payload: any, onRestore?: (draft: any) => void) {
  const saveTimer = useRef<number | null>(null)
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

  useEffect(() => {
    if (!role) return
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current)
    }

    saveTimer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(`draft_${role}`, JSON.stringify(payload))
      } catch (e) {
        console.warn('useFormDraft: save failed', e)
      }
      saveTimer.current = null
    }, 2000)

    return () => {
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current)
        saveTimer.current = null
      }
    }
  }, [role, payload])
}