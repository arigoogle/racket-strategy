import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

interface PWAInstallState {
  installable: boolean
  installed: boolean
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>
}

function checkInstalled(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // @ts-expect-error iOS Safari uses navigator.standalone
    window.navigator.standalone === true
  )
}

export function usePWAInstall(): PWAInstallState {
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState<boolean>(checkInstalled)

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setEvent(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setEvent(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    const mql = window.matchMedia('(display-mode: standalone)')
    const onChange = () => setInstalled(checkInstalled())
    mql.addEventListener?.('change', onChange)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      mql.removeEventListener?.('change', onChange)
    }
  }, [])

  return {
    installable: !!event && !installed,
    installed,
    promptInstall: async () => {
      if (!event) return 'unavailable'
      await event.prompt()
      const choice = await event.userChoice
      setEvent(null)
      return choice.outcome
    },
  }
}
