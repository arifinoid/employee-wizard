import { useState } from "react"

async function sleep(delay: number) {
  await new Promise(resolve => setTimeout(resolve, delay))
}

export const useAsyncSubmit = () => {
  const [logs, setLogs] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message])
  }

  const submit = async (
    basic: any,
    details: any,
    onSuccess: () => void,
    options?: { skipBasic?: boolean; fallbackEmail?: string }
  ) => {
    setIsSubmitting(true)
    setLogs([])

    try {
      if (!options?.skipBasic) {
        addLog('⏳ Submitting basicInfo...')
        const basicRes = await fetch('http://localhost:4001/basicInfo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(basic),
        })
        await sleep(3000)
        if (basicRes.ok) addLog('✅ basicInfo saved!')
        else throw new Error('Basic info failed')
      } else {
        addLog('ℹ️ Skipping basicInfo (role: ops)')
      }

      addLog('⏳ Submitting details...')
      const emailForDetails = basic?.email || options?.fallbackEmail || ''
      const detailsRes = await fetch('http://localhost:4002/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...details, email: emailForDetails }),
      })
      await sleep(3000)
      if (detailsRes.ok) addLog('✅ details saved!')
      else throw new Error('Details failed')

      addLog('🎉 All data processed successfully!')
      setTimeout(onSuccess, 1000)
    } catch (error) {
      addLog('❌ Submission failed!')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearLogs = () => setLogs([])

  return { submit, logs, isSubmitting, addLog, clearLogs }
}